// Password protection for case studies
(function() {
    // Get the case study number from the URL or page
    const currentPage = window.location.pathname;
    let caseStudyNum = null;
    let requiredPassword = null;
    
    // Determine case study number and required password
    if (currentPage.includes('case-study-1.html')) {
        caseStudyNum = 1;
        requiredPassword = 'etdworkinprogress';
    } else if (currentPage.includes('case-study-2.html')) {
        caseStudyNum = 2;
        requiredPassword = 'etdwork';
    } else if (currentPage.includes('case-study-3.html')) {
        caseStudyNum = 3;
        requiredPassword = 'etdwork';
    } else if (currentPage.includes('case-study-4.html')) {
        caseStudyNum = 4;
        requiredPassword = 'etdwork';
    } else if (currentPage.includes('case-study-5.html')) {
        caseStudyNum = 5;
        requiredPassword = 'etdworkinprogress';
    } else {
        // Case study 6 or other pages - no password required
        return;
    }
    
    // Check if password is already stored in sessionStorage
    const sessionKey = `case-study-${caseStudyNum}-unlocked`;
    if (sessionStorage.getItem(sessionKey) === 'true') {
        return; // Already unlocked, show the page
    }
    
    // Hide the main content
    const mainContent = document.querySelector('.case-study-main');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Create password form
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-container';
    passwordContainer.innerHTML = `
        <div class="password-form-wrapper">
            <div class="password-form">
                <h2 class="password-title">Password Protected</h2>
                <p class="password-subtitle">This case study is password protected.</p>
                <input type="password" id="password-input" class="password-input" placeholder="Enter password" autofocus>
                <button id="password-submit" class="password-submit">Submit</button>
                <p id="password-error" class="password-error" style="display: none;">Incorrect password. Please try again.</p>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .password-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .password-form-wrapper {
            width: 100%;
            max-width: 400px;
            padding: 40px;
        }
        .password-form {
            text-align: center;
        }
        .password-title {
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 2rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
        }
        .password-subtitle {
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 1rem;
            color: #666;
            margin-bottom: 32px;
        }
        .password-input {
            width: 100%;
            padding: 12px 16px;
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 1rem;
            border: 1px solid #E1E1E3;
            border-radius: 8px;
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        .password-input:focus {
            outline: none;
            border-color: #1a1a1a;
        }
        .password-submit {
            width: 100%;
            padding: 12px 24px;
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #FFFFFF;
            background-color: #1a1a1a;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .password-submit:hover {
            background-color: #333;
        }
        .password-error {
            font-family: 'Be Vietnam Pro', sans-serif;
            font-size: 0.875rem;
            color: #d32f2f;
            margin-top: 12px;
        }
    `;
    document.head.appendChild(style);
    
    // Insert password form
    document.body.appendChild(passwordContainer);
    
    // Handle password submission
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === requiredPassword) {
            // Store in sessionStorage
            sessionStorage.setItem(sessionKey, 'true');
            // Remove password form
            passwordContainer.remove();
            // Show main content
            if (mainContent) {
                mainContent.style.display = 'block';
            }

            // Notify other scripts (e.g. hero animations) that the case study is now visible
            window.dispatchEvent(
                new CustomEvent('caseStudyUnlocked', {
                    detail: { caseStudyNum }
                })
            );
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
})();
