from flask import Flask, request, jsonify, session
import os
import dotenv
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet
from flask_session import Session
from agent import generate_email

# Load or generate persistent Fernet key
def get_or_create_key():
    key_file = "fernet.key"
    if os.path.exists(key_file):
        with open(key_file, "rb") as f:
            return f.read()
    else:
        key = Fernet.generate_key()
        with open(key_file, "wb") as f:
            f.write(key)
        return key

key = get_or_create_key()
f = Fernet(key)

dotenv.load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://mail.google.com"}})



app.secret_key = "supersecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
Session(app)


# Local SQLite database (single file, no separate server)
LOCAL_DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "email_responder.db")


def get_db():
    return sqlite3.connect(LOCAL_DB)


def init_db():
    """Create the users table if it doesn't exist."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            openAI_key BLOB,
            gemini_key BLOB,
            choice TEXT,
            sign_off TEXT,
            updated_at TEXT
        )
    """)
    conn.commit()
    cur.close()
    conn.close()


# Ensure database and table exist on startup
init_db()


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data["email"]
    password = data["password"]

    print(f"Signup attempt for email: {email}")

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    if cur.fetchone():
        print(f"Signup failed - user already exists: {email}")
        return jsonify({"success": False, "error": "User already exists"}), 400

    hashed = generate_password_hash(password)
    cur.execute("INSERT INTO users (email, password_hash) VALUES (?, ?)", (email, hashed))
    db.commit()
    cur.close()
    db.close()
    
    session["email"] = email
    print(f"Signup successful for email: {email}")
    print(f"Session after signup: {session}")
    print(f"Email in session after signup: {session.get('email', 'NOT FOUND')}")
    
    return jsonify({"success": True})

@app.route("/check-session", methods=["GET"])
def check_session():
    if "email" not in session:
        return jsonify({"loggedIn": False})
    return jsonify({"loggedIn": True})

@app.route("/profile", methods=["GET"])
def profile():
    print(f"Profile endpoint - Session contents: {session}")
    print(f"Profile endpoint - Email in session: {session.get('email', 'NOT FOUND')}")
    
    if "email" not in session:
        return jsonify({"success": False, "error": "Not logged in"}), 401

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT openAI_key, gemini_key, choice FROM users WHERE email = ?", (session["email"],))
    row = cur.fetchone()
    cur.close()
    db.close()

    if not row:
        return jsonify({"success": False, "error": "Profile not found"}), 404

    # Handle None values from database
    openai_key = row[0] if row[0] else ""
    gemini_key = row[1] if row[1] else ""
    llm_choice = row[2] if row[2] else "default"

    # Decrypt the API keys if they exist
    try:
        if openai_key:
            openai_key = f.decrypt(openai_key).decode()
    except Exception as e:
        print(f"Failed to decrypt OpenAI key: {e}")
        openai_key = ""
    
    try:
        if gemini_key:
            gemini_key = f.decrypt(gemini_key).decode()
    except Exception as e:
        print(f"Failed to decrypt Gemini key: {e}")
        gemini_key = ""

    return jsonify({
        "success": True,
        "openai_key": openai_key,
        "gemini_key": gemini_key,
        "llm_choice": llm_choice
    })

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    print(f"Login attempt for email: {email}")

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT password_hash FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    cur.close()
    db.close()

    if not row or not check_password_hash(row[0], password):
        print(f"Login failed for email: {email}")
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

    session["email"] = email
    print(f"Login successful for email: {email}")
    print(f"Session after login: {session}")
    print(f"Email in session after login: {session.get('email', 'NOT FOUND')}")
    
    return jsonify({"success": True})

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("email", None)
    return jsonify({"success": True})

@app.route("/save-profile", methods=["POST"])
def save_profile():
    print(f"Session contents: {session}")
    print(f"Email in session: {session.get('email', 'NOT FOUND')}")
    
    if "email" not in session:
        return jsonify({"success": False, "error": "Not logged in"}), 401

    data = request.json
    signoff = data.get("signoff", "").strip()
    openai_key = data.get("openaiKey", "").strip()
    gemini_key = data.get("geminiKey", "").strip()
    llm_choice = data.get("llmChoice", "default")

    # Convert empty strings to None for database storage
    openai_key = openai_key if openai_key else None
    gemini_key = gemini_key if gemini_key else None
    signoff = signoff if signoff else None

    # Only encrypt if the keys are not None
    encrypted_openai_key = f.encrypt(openai_key.encode()) if openai_key else None
    encrypted_gemini_key = f.encrypt(gemini_key.encode()) if gemini_key else None

    print(f"Saving profile for email: {session['email']}")
    print(f"Signoff: {signoff if signoff else 'None'}")
    print(f"OpenAI key: {openai_key[:10] if openai_key else 'None'}...")
    print(f"Gemini key: {gemini_key[:10] if gemini_key else 'None'}...")
    print(f"LLM choice: {llm_choice}")

    db = get_db()
    cur = db.cursor()
    if signoff:
        cur.execute(
            "UPDATE users SET openAI_key = ?, gemini_key = ?, choice = ?, sign_off = ?, updated_at = datetime('now') WHERE email = ?",
            (encrypted_openai_key, encrypted_gemini_key, llm_choice, signoff, session["email"])
        )
    else:
        cur.execute(
            "UPDATE users SET openAI_key = ?, gemini_key = ?, choice = ?, updated_at = datetime('now') WHERE email = ?",
            (encrypted_openai_key, encrypted_gemini_key, llm_choice, session["email"])
        )

    db.commit()
    cur.close()
    db.close()

    return jsonify({"success": True})

@app.route("/generate", methods=["POST"])
def generate():
    if "email" not in session:
        return jsonify({"error": "Not logged in"}), 401

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT choice FROM users WHERE email = ?", (session["email"],))
    row = cur.fetchone()
    if not row or not row[0]:
        return jsonify({"error": "No API key configured for this account"}), 400
    elif row[0] == "openai":
        agent= "openai"
        cur.execute("SELECT openAI_key FROM users WHERE email = ?", (session["email"],))
    elif row[0] == "gemini":
        agent = "gemini"
        cur.execute("SELECT gemini_key FROM users WHERE email = ?", (session["email"],))
    key_row = cur.fetchone()
    cur.execute("SELECT sign_off FROM users WHERE email = ?", (session["email"],))
    signoff_row = cur.fetchone()
    cur.close()
    db.close()

    if not row or not row[0] or row[0]==None:
        return jsonify({"error": f"No API key for '{agent}' configured for this account"}), 400
    
    signoff = signoff_row[0] if signoff_row and signoff_row[0] else None
    encrypted_api_key = key_row[0]
    
    # Only decrypt if the encrypted key is not None
    if encrypted_api_key:
        try:
            decrypted_api_key = f.decrypt(encrypted_api_key).decode()
        except Exception as e:
            print(f"Failed to decrypt API key for {agent}: {e}")
            return jsonify({"error": f"Failed to decrypt API key for '{agent}'. Please update your API key in your profile."}), 400
    else:
        return jsonify({"error": f"No API key for '{agent}' configured for this account"}), 400

    data = request.json
    recipient = data.get("recipient")
    query = data.get("query")
    info = data.get("info")
    tone = data.get("tone")
    print(f"Generating email with agent: {agent}, recipient: {recipient}, query: {query}, info: {info}, tone: {tone}")

    # Example of passing api_key to OpenAI / Gemini
    # (replace this with actual request to LLM API)
    response_text = generate_email(agent, decrypted_api_key, recipient,query, info, tone)
    if signoff:
        response_text += f"\n\n{signoff}"
    else:
        response_text += "\n\nBest regards,\n[Your Name]"

    return jsonify({"response": response_text})

if __name__ == "__main__":
    app.run(debug=True, port=3212)