# 📧 Email Responder Plugin

An AI-powered Google Chrome extension designed to streamline your Gmail workflow. This tool integrates directly into your browser to help you draft professional emails using OpenAI or Gemini models based on your specific queries and context.

---

## 🚀 Getting Started

Currently, this project runs in a **local development environment**. Follow these steps to get the plugin up and running on your machine.

### 1. Clone the Repository
Open your terminal and clone the project to your local machine:

### 2. Set Up a Virtual Environment (Recommended)
Creating a virtual environment keeps your project dependencies isolated.

On Windows:

Bash
python -m venv venv
.\venv\Scripts\activate
On macOS/Linux:

Bash
python3 -m venv venv
source venv/bin/activate

### 3. Install Dependencies
Once your virtual environment is active, install the required Python packages:

Bash
pip install -r requirements.txt

### 4. Install the Chrome Extension
Open Google Chrome and navigate to chrome://extensions/.

In the top right corner, toggle Developer mode to ON.

Click the Load unpacked button that appears on the main page.

Select the folder containing the cloned repository.

Give it a few minutes to update and register the extension.

### 5. Launch the Backend Server
The extension requires a Python backend to handle API requests and database management.

In your terminal, navigate to the directory that contains this repo.

Run the server:

Bash
python server.py
or 
python3 server.py
Note: Keep this terminal window open while using the plugin.

🛠️ Configuration & Usage
Initial Setup
Navigate to Gmail: Open your Gmail inbox. You should see a small mail icon in the bottom corner.

Create an Account: Click the icon and register.

🔒 Privacy Note: All data is stored locally in email_responder.db. Your information is never publically accessible.

Configure Profile: * Click Profile in the menu.

Add your custom Email Signature.

Enter your API Keys (OpenAI or Gemini).

Tip: Gemini is free and offers an easier process for getting a key.
To get a Gemini API key, go to Google AI Studio, sign in with your Google account, and click "Get API key" on the left-hand menu. 
You can then create a key in a new or existing Google Cloud project and copy the string to use in your applications. 

Save Changes: You will be redirected back to the main menu.

Drafting Emails
Once configured, you can use the following fields:

Recipient: Who you are sending the email to.

Query: What you want to say or the intent of the message.

Additional Information: Any extra content or context to help the AI agent write the draft.

🔐 Security
Even though your information is stored locally, we implement the following security measures:

API Key Protection: Your keys are encrypted using a revolving Fernet key.

Password Safety: Your password is encrypted with a Hash key so it is never stored in plain text.

🔍 Troubleshooting
If the plugin does not work, check the terminal running your server. Error messages will be printed there.

Most common issues:

Invalid API Key: Ensure the key is copied correctly into your profile.

Insufficient Funds: Check if your API provider account has active credits.
