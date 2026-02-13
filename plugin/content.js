if (location.hostname === "mail.google.com") {
    initEmailResponder();
}

function passwordChecker(str) {
    const hasNumber = /[0-9]/.test(str);
    const hasSpecial = /[^a-zA-Z0-9\s]/.test(str);
    const hasUppercase = /[A-Z]/.test(str);
    return hasNumber && hasSpecial && hasUppercase;
}

// Email validation function
function isValidEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: "Email address is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, message: "Please enter a valid email address" };
    }
    
    return { valid: true, message: "" };
}

// Add CSS styles to the page
function injectStyles() {
    if (document.getElementById('email-responder-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'email-responder-styles';
    style.textContent = `
        .er-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            max-height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .er-header {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 16px 16px 0 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            position: relative;
            flex-shrink: 0;
            cursor: move;
        }
        
        .er-header h3 {
            margin: 0;
            color: white;
            font-size: 20px;
            font-weight: 600;
        }
        
        .er-resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(-45deg, transparent 0%, transparent 30%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.3) 35%, transparent 35%, transparent 65%, rgba(255,255,255,0.3) 65%, rgba(255,255,255,0.3) 70%, transparent 70%);
            cursor: nw-resize;
            border-radius: 0 0 16px 0;
        }
        
        .er-content {
            padding: 30px;               
            background: white;
            border-radius: 0 0 16px 16px;
            overflow-y: auto;
            flex: 1 1 auto;
            min-height: 0;
            max-height: calc(90vh - 200px);
            }

        .er-footer {
            flex-shrink: 0;
            padding: 16px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
        }
        
        .er-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .er-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .er-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .er-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        .er-form-group {
            margin-bottom: 16px;
        }
        
        .er-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
            font-size: 14px;
        }
        
        .er-input, .er-textarea, .er-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
            box-sizing: border-box;
            font-family: inherit;
        }
        
        .er-input:focus, .er-textarea:focus, .er-select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .er-input.er-error-input, .er-textarea.er-error-input {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .er-textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .er-textarea.small {
            min-height: 40px;
        }
        
        .er-textarea.large {
            min-height: 100px;
        }
        
        .er-button {
            display: inline-flex;          /* ensure padding applies evenly */
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;       /* tweak these values as needed */
            font-size: 1rem;               /* make sure both use this */
            line-height: 1.2;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }
        
        .er-button:last-child {
            margin-bottom: 0;
        }
        
        .er-button-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .er-button-primary:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .er-button-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
        }
        
        .er-button-secondary:hover:not(:disabled) {
            background: #e5e7eb;
        }
        
        .er-button-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .er-button-success:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        .er-button-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }
        
        .er-button-danger:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .er-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .er-profile-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .er-profile-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
        }
        
        .er-floating-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            border: none;
        }
        
        .er-floating-icon:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        
        .er-popup {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 420px;
            min-width: 350px;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 140px);
            z-index: 9999;
            display: none;
            animation: slideInUp 0.3s ease;
            resize: both;
            overflow: hidden;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .er-tone-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .er-loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .er-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
        }
        
        .er-success {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
        }

        .er-expand-btn {
            position: absolute;
            top: 15px;
            right: 90px;
            padding: 8px 12px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .er-expand-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
        }

        /* Position expand button differently when profile button is not present */
        .er-header:not(:has(.er-profile-btn)) .er-expand-btn {
            right: 20px;
        }

        .er-popup.expanded {
            width: 600px;
            height: 700px;
        }

        .er-popup.expanded .er-content {
            max-height: calc(700px - 100px);
        }
    `;
    document.head.appendChild(style);
}

function initEmailResponder() {
    console.log("Initializing Email Responder on Gmail…");
    
    injectStyles();

    const icon = createFloatingIcon();
    const container = createPopupContainer();
    
    icon.addEventListener("click", () => togglePopup(container));

    // Make popup draggable and resizable
    makeDraggable(container);
    makeResizable(container);

    checkSession(container);
}

function createFloatingIcon() {
    const btn = document.createElement("button");
    btn.innerHTML = "✉️";
    btn.className = "er-floating-icon";
    document.body.appendChild(btn);
    return btn;
}

function createPopupContainer() {
    const container = document.createElement("div");
    container.className = "er-popup";
    document.body.appendChild(container);
    return container;
}

function togglePopup(popup) {
    popup.style.display = popup.style.display === "none" ? "block" : "none";
}

// Make popup draggable
function makeDraggable(popup) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
        if (e.target.closest('.er-header')) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === popup.querySelector('.er-header') || e.target.closest('.er-header h3')) {
                isDragging = true;
            }
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            popup.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    popup.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);
}

// Make popup resizable
function makeResizable(popup) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'er-resize-handle';
    
    let isResizing = false;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    });
    
    function resize(e) {
        if (!isResizing) return;
        
        const rect = popup.getBoundingClientRect();
        const newWidth = Math.max(350, e.clientX - rect.left);
        const newHeight = Math.max(400, e.clientY - rect.top);
        
        popup.style.width = newWidth + 'px';
        popup.style.height = newHeight + 'px';
        
        // Update content max-height
        const content = popup.querySelector('.er-content');
        if (content) {
            content.style.maxHeight = (newHeight - 100) + 'px';
        }
    }
    
    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
    
    // Add resize handle to container when it's created
    const observer = new MutationObserver(() => {
        const container = popup.querySelector('.er-container');
        if (container && !container.querySelector('.er-resize-handle')) {
            container.appendChild(resizeHandle);
        }
    });
    
    observer.observe(popup, { childList: true, subtree: true });
}

function checkSession(container) {
    fetch("http://localhost:3212/check-session", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            showMainUI(container);
        } else {
            showLoginUI(container);
        }
    })
    .catch(err => {
        console.error(err);
        showLoginUI(container);
    });
}

function showLoginUI(container) {
    container.innerHTML = `
        <div class="er-container">
            <div class="er-header">
                <h3>Sign In to Email Responder</h3>
                <button id="expandBtn" class="er-expand-btn">Expand</button>
            </div>
            <div class="er-content">
                <div class="er-form-group">
                    <label class="er-label">Email Address</label>
                    <input id="email" type="email" class="er-input" placeholder="Enter your email">
                </div>
                <div class="er-form-group">
                    <label class="er-label">Password</label>
                    <input id="password" type="password" class="er-input" placeholder="Enter your password">
                </div>
                <button id="loginBtn" class="er-button er-button-primary">Sign In</button>
                <button id="toSignupBtn" class="er-button er-button-secondary">Create New Account</button>
            </div>
        </div>
    `;

    bindExpandButton(container);
    bindLoginEvents(container);
}

function bindExpandButton(container) {
    const expandBtn = container.querySelector("#expandBtn");
    if (expandBtn) {
        expandBtn.addEventListener("click", () => {
            container.classList.toggle("expanded");
            expandBtn.textContent = container.classList.contains("expanded") ? "Shrink" : "Expand";
        });
    }
}

function bindLoginEvents(container) {
    container.querySelector("#loginBtn").addEventListener("click", () => {
        const btn = container.querySelector("#loginBtn");
        const emailInput = container.querySelector("#email");
        const passwordInput = container.querySelector("#password");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous error states
        emailInput.classList.remove('er-error-input');
        passwordInput.classList.remove('er-error-input');

        // Validate email
        const emailValidation = isValidEmail(email);
        if (!emailValidation.valid) {
            emailInput.classList.add('er-error-input');
            showError(container, emailValidation.message);
            return;
        }

        // Validate password
        if (!password) {
            passwordInput.classList.add('er-error-input');
            showError(container, "Password is required");
            return;
        }

        btn.innerHTML = '<span class="er-loading"></span>Signing In...';
        btn.disabled = true;

        fetch("http://localhost:3212/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMainUI(container);
            } else {
                showError(container, "Login failed. Please check your credentials.");
                btn.innerHTML = 'Sign In';
                btn.disabled = false;
            }
        })
        .catch(err => {
            showError(container, "Connection error. Please try again.");
            btn.innerHTML = 'Sign In';
            btn.disabled = false;
        });
    });

    container.querySelector("#toSignupBtn").addEventListener("click", () => {
        showSignupUI(container);
    });
}

function showSignupUI(container) {
    container.innerHTML = `
        <div class="er-container">
            <div class="er-header">
                <h3>Create Your Account</h3>
                <button id="expandBtn" class="er-expand-btn">Expand</button>
            </div>
            <div class="er-content">
                <div class="er-form-group">
                    <label class="er-label">Email Address</label>
                    <input id="email" type="email" class="er-input" placeholder="Enter your email">
                </div>
                <div class="er-form-group">
                    <label class="er-label">Password</label>
                    <input id="password" type="password" class="er-input" placeholder="Create a strong password">
                    <small style="color: #6b7280; font-size: 12px; margin-top: 4px; display: block;">
                        Password must contain uppercase, number, and special character
                    </small>
                </div>
                <button id="signupBtn" class="er-button er-button-primary">Create Account</button>
                <button id="toLoginBtn" class="er-button er-button-secondary">Back to Sign In</button>
            </div>
        </div>
    `;

    bindExpandButton(container);
    bindSignupEvents(container);
}

function bindSignupEvents(container) {
    container.querySelector("#signupBtn").addEventListener("click", () => {
        const btn = container.querySelector("#signupBtn");
        const emailInput = container.querySelector("#email");
        const passwordInput = container.querySelector("#password");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous error states
        emailInput.classList.remove('er-error-input');
        passwordInput.classList.remove('er-error-input');

        // Validate email
        const emailValidation = isValidEmail(email);
        if (!emailValidation.valid) {
            emailInput.classList.add('er-error-input');
            showError(container, emailValidation.message);
            return;
        }

        // Validate password
        if (!password) {
            passwordInput.classList.add('er-error-input');
            showError(container, "Password is required");
            return;
        }
        
        if (!passwordChecker(password)) {
            passwordInput.classList.add('er-error-input');
            showError(container, "Password must contain at least one uppercase letter, one number, and one special character.");
            return;
        }

        btn.innerHTML = '<span class="er-loading"></span>Creating Account...';
        btn.disabled = true;

        fetch("http://localhost:3212/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMainUI(container);
            } else {
                showError(container, "Account creation failed. Email may already be in use.");
                btn.innerHTML = 'Create Account';
                btn.disabled = false;
            }
        })
        .catch(err => {
            showError(container, "Connection error. Please try again.");
            btn.innerHTML = 'Create Account';
            btn.disabled = false;
        });
    });

    container.querySelector("#toLoginBtn").addEventListener("click", () => {
        showLoginUI(container);
    });
}

function showMainUI(container) {
    container.innerHTML = `
        <div class="er-container">
            <div class="er-header">
                <h3>Email Responder</h3>
                <button id="expandBtn" class="er-expand-btn">Expand</button>
                <button id="profileBtn" class="er-profile-btn">Profile</button>
            </div>
            <div class="er-content">
                <div class="er-form-group">
                    <label class="er-label">Recipient</label>
                    <textarea class="er-textarea small" placeholder="Who are you writing to?"></textarea>
                </div>
                <div class="er-form-group">
                    <label class="er-label">Your Query</label>
                    <textarea class="er-textarea" placeholder="What do you want to say?"></textarea>
                </div>
                <div class="er-form-group">
                    <label class="er-label">Additional Information</label>
                    <textarea class="er-textarea" placeholder="Any context or details to include?"></textarea>
                </div>
                <div class="er-form-group">
                    <label class="er-label">Tone</label>
                    <select class="er-select">
                        <option>Friendly</option>
                        <option>Professional</option>
                        <option>Empathetic</option>
                        <option>Concise</option>
                        <option>Apologetic</option>
                        <option>Informative</option>
                        <option>Urgent</option>
                        <option>Grateful</option>
                        <option>Assertive</option>
                        <option>Humorous</option>
                        <option>Supportive</option>
                        <option>Respectful</option>
                        <option>Inspirational</option>
                    </select>
                </div>
                <div class="er-form-group">
                    <label class="er-label">Generated Response</label>
                    <textarea class="er-textarea large" placeholder="Your AI-generated email will appear here..."></textarea>
                </div>
                <div class="er-footer">
                    <button id="generateBtn" class="er-button er-button-primary">Generate Email</button>
                    <button id="logoutBtn"   class="er-button er-button-danger">Sign Out</button>
                </div>
            </div>
        </div>
    `;
    
    bindExpandButton(container);
    bindMainUIEvents(container);
}

function bindMainUIEvents(container) {
    bindProfileButton(container);
    bindGenerateButton(container);
    bindLogoutButton(container);
}

function bindProfileButton(container) {
    const btn = container.querySelector("#profileBtn");
    btn.addEventListener("click", () => {
        showProfilesUI(container);
    });
}

function showProfilesUI(container) {
    fetch("http://localhost:3212/profile", {
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        const signoff = data.signoff || "";
        const openaiKey = data.openai_key || "";
        const geminiKey = data.gemini_key || "";
        const llmChoice = data.llm_choice || "openai";

        container.innerHTML = `
            <div class="er-container">
                <div class="er-header">
                    <h3>Your Profile Settings</h3>
                    <button id="expandBtn" class="er-expand-btn">Expand</button>
                </div>
                <div class="er-content">
                    <div class="er-form-group">
                        <label class="er-label">Email Signature</label>
                        <textarea id="signoff" class="er-textarea small" placeholder="Best regards,\nYour Name">${signoff}</textarea>
                    </div>
                    <div class="er-form-group">
                        <label class="er-label">OpenAI API Key</label>
                        <input id="openaiKey" type="password" class="er-input" value="${openaiKey}" placeholder="sk-...">
                    </div>
                    <div class="er-form-group">
                        <label class="er-label">Gemini API Key</label>
                        <input id="geminiKey" type="password" class="er-input" value="${geminiKey}" placeholder="AI...">
                    </div>
                    <div class="er-form-group">
                        <label class="er-label">Preferred AI Model</label>
                        <select id="llmChoice" class="er-select">
                            <option value="openai" ${llmChoice === "openai" ? "selected" : ""}>OpenAI GPT</option>
                            <option value="gemini" ${llmChoice === "gemini" ? "selected" : ""}>Google Gemini</option>
                        </select>
                    </div>
                    <button id="saveProfileBtn" class="er-button er-button-success">Save Changes</button>
                    <button id="backToMainBtn" class="er-button er-button-secondary">Back to Main</button>
                </div>
            </div>
        `;

        bindExpandButton(container);
        bindProfileEvents(container);
    })
    .catch(err => {
        console.error("Error fetching profile:", err);
        showError(container, "Failed to load profile data.");
    });
}

function bindProfileEvents(container) {
    container.querySelector("#saveProfileBtn").addEventListener("click", () => {
        const btn = container.querySelector("#saveProfileBtn");
        const signoff = container.querySelector("#signoff").value.trim();
        const openaiKey = container.querySelector("#openaiKey").value.trim();
        const geminiKey = container.querySelector("#geminiKey").value.trim();
        const llmChoice = container.querySelector("#llmChoice").value;

        btn.innerHTML = '<span class="er-loading"></span>Saving...';
        btn.disabled = true;

        fetch("http://localhost:3212/save-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ signoff, openaiKey, geminiKey, llmChoice })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showSuccess(container, "Profile saved successfully!");
                setTimeout(() => showMainUI(container), 1500);
            } else {
                showError(container, "Failed to save profile: " + (data.message || ""));
                btn.innerHTML = 'Save Changes';
                btn.disabled = false;
            }
        })
        .catch(err => {
            showError(container, "Error saving profile.");
            btn.innerHTML = 'Save Changes';
            btn.disabled = false;
        });
    });

    container.querySelector("#backToMainBtn").addEventListener("click", () => {
        showMainUI(container);
    });
}

function bindGenerateButton(container) {
    const btn = container.querySelector("#generateBtn");
    btn.addEventListener("click", () => {
        const recipient = container.querySelectorAll("textarea")[0].value.trim();
        const query = container.querySelectorAll("textarea")[1].value.trim();
        const info = container.querySelectorAll("textarea")[2].value.trim();
        const tone = container.querySelector("select").value;
        const responseBox = container.querySelectorAll("textarea")[3];

        if (!query) {
            showError(container, "Please enter your query before generating.");
            return;
        }

        btn.innerHTML = '<span class="er-loading"></span>Generating...';
        btn.disabled = true;
        responseBox.value = "Generating your email...";

        fetch("http://localhost:3212/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ recipient, query, info, tone })
        })
        .then(res => res.json())
        .then(data => {
            responseBox.value = data.response || "No response generated";
            btn.innerHTML = 'Generate Email';
            btn.disabled = false;
        })
        .catch(err => {
            console.error(err);
            responseBox.value = "Error generating email. Please try again.";
            btn.innerHTML = 'Generate Email';
            btn.disabled = false;
        });
    });
}

function bindLogoutButton(container) {
    const btn = container.querySelector("#logoutBtn");
    btn.addEventListener("click", () => {
        fetch("http://localhost:3212/logout", {
            method: "POST",
            credentials: "include"
        })
        .then(() => {
            showLoginUI(container);
        })
        .catch(err => {
            console.error(err);
            showLoginUI(container);
        });
    });
}

function showError(container, message) {
    const existing = container.querySelector('.er-error');
    if (existing) existing.remove();
    
    const error = document.createElement('div');
    error.className = 'er-error';
    error.textContent = message;
    
    const content = container.querySelector('.er-content');
    content.insertBefore(error, content.firstChild);
    
    setTimeout(() => error.remove(), 5000);
}

function showSuccess(container, message) {
    const existing = container.querySelector('.er-success');
    if (existing) existing.remove();
    
    const success = document.createElement('div');
    success.className = 'er-success';
    success.textContent = message;
    
    const content = container.querySelector('.er-content');
    content.insertBefore(success, content.firstChild);
    
    setTimeout(() => success.remove(), 3000);
}