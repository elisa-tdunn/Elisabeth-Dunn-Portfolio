// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add any additional interactive features here
    console.log('Portfolio loaded');
    
    // Animate welcome section on page load
    function animateWelcomeSection() {
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeDescription = document.querySelector('.welcome-description');
        const welcomeImageWrapper = document.querySelector('.welcome-image-wrapper');
        
        if (!welcomeTitle || !welcomeDescription || !welcomeImageWrapper) return;
        
        // Store original text
        const titleText = welcomeTitle.textContent;
        
        // Split title into words and wrap each word
        const titleWords = titleText.split(' ');
        welcomeTitle.innerHTML = titleWords.map(word => `<span class="word">${word}</span>`).join(' ');
        
        // For description, preserve HTML by walking text nodes
        const descriptionHTML = welcomeDescription.innerHTML;
        // Use regex to wrap words, but be careful with HTML tags
        // Match words that are not inside HTML tags
        const wrappedDescription = descriptionHTML.replace(/(?![^<]*>)(\b\w+\b)/g, '<span class="word">$1</span>');
        welcomeDescription.innerHTML = wrappedDescription;
        
        // Get all word spans
        const titleWordSpans = welcomeTitle.querySelectorAll('.word');
        const descriptionWordSpans = welcomeDescription.querySelectorAll('.word');
        
        // Animate title words one by one
        titleWordSpans.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * 100); // 100ms delay between each word
        });
        
        // After title animation completes, animate description words
        const titleAnimationTime = titleWordSpans.length * 100 + 600; // word delays + animation duration
        
        setTimeout(() => {
            descriptionWordSpans.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.add('animate');
                }, index * 80); // 80ms delay between each word
            });
            
            // After description animation completes, trigger hover state
            const descriptionAnimationTime = descriptionWordSpans.length * 80 + 600;
            
            setTimeout(() => {
                // Add auto-hover class to trigger hover state
                welcomeImageWrapper.classList.add('auto-hover');
                
                // Remove auto-hover class after 1.5 seconds
                setTimeout(() => {
                    welcomeImageWrapper.classList.remove('auto-hover');
                }, 1500);
            }, descriptionAnimationTime);
        }, titleAnimationTime);
    }
    
    // Track if user clicked the back link
    const backLinks = document.querySelectorAll('.back-link-nav');
    backLinks.forEach(link => {
        link.addEventListener('click', function() {
            sessionStorage.setItem('navigated-from-back-link', 'true');
        });
    });
    
    // Run welcome animation on page load (only on initial load/refresh, not back/forward or back link)
    function shouldAnimateWelcome() {
        // Check if user navigated from back link
        if (sessionStorage.getItem('navigated-from-back-link') === 'true') {
            sessionStorage.removeItem('navigated-from-back-link'); // Clear the flag
            return false;
        }
        
        // Check navigation type using Performance Navigation API
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            // Don't animate on back/forward navigation
            if (navigation.type === 'back_forward') {
                return false;
            }
            // Animate on initial load ('navigate') or refresh ('reload')
            if (navigation.type === 'navigate' || navigation.type === 'reload') {
                return true;
            }
        }
        
        // Fallback: check if page was loaded via back button using legacy API
        if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
            return false;
        }
        
        // Default to animating if we can't determine navigation type
        return true;
    }
    
    if (shouldAnimateWelcome()) {
        animateWelcomeSection();
    }
    
    // Fade in content when the first section label scrolls into view (once faded in, it stays visible)
    function handleHeroScroll() {
        const firstSectionLabel = document.querySelector('.case-section-label');
        const sections = document.querySelectorAll('.case-hero-section, .case-problem-section, .case-discovery-section, .case-testing-section, .case-final-section, .case-image-section');
        
        if (!firstSectionLabel) {
            // If no section label exists, show content immediately
            sections.forEach(section => {
                section.classList.add('fade-in');
            });
            return;
        }
        
        const labelTop = firstSectionLabel.offsetTop;
        const labelBottom = labelTop + firstSectionLabel.offsetHeight;
        const scrollTop = window.scrollY || window.pageYOffset;
        const viewportBottom = scrollTop + window.innerHeight;
        
        // If the label is visible in the viewport OR if we've scrolled past it, fade in the content
        // Once faded in, it never fades out
        if (viewportBottom >= labelTop || scrollTop > labelBottom) {
            sections.forEach(section => {
                section.classList.add('fade-in');
            });
        }
    }
    
    // On initial load, check if content should be visible based on current scroll position
    function initializeContentVisibility() {
        const firstSectionLabel = document.querySelector('.case-section-label');
        const sections = document.querySelectorAll('.case-hero-section, .case-problem-section, .case-discovery-section, .case-testing-section, .case-final-section, .case-image-section');
        
        if (!firstSectionLabel) {
            // If no section label exists, show content immediately
            sections.forEach(section => {
                section.classList.add('fade-in');
            });
            return;
        }
        
        const labelTop = firstSectionLabel.offsetTop;
        const scrollTop = window.scrollY || window.pageYOffset;
        const viewportBottom = scrollTop + window.innerHeight;
        
        // If we're at the top of the page OR if the label is already in view OR if we've scrolled past it, show content
        if (scrollTop === 0 || viewportBottom >= labelTop || scrollTop > labelTop) {
            sections.forEach(section => {
                section.classList.add('fade-in');
            });
        }
    }
    
    // Run on scroll
    window.addEventListener('scroll', handleHeroScroll);
    
    // Initialize visibility on page load
    initializeContentVisibility();
    
    function isPasswordGateActive() {
        // If the password overlay exists, the case study content is intentionally hidden
        if (document.querySelector('.password-container')) return true;

        const mainContent = document.querySelector('.case-study-main');
        if (!mainContent) return false;
        return mainContent.style.display === 'none';
    }

    // Animate hero title word by word, then fade in the body
    function animateHeroContent() {
        const title = document.querySelector('.case-study-title');
        const body = document.querySelector('.case-study-body');
        
        if (!title || !body) return;
        
        // Reset body state so the fade-in transition can run reliably
        body.classList.remove('fade-in');

        // Split title into words and wrap each word in a span
        const titleText = title.dataset.originalText || title.textContent;
        if (!title.dataset.originalText) {
            title.dataset.originalText = titleText;
        }
        const titleWords = titleText.split(' ');
        title.innerHTML = titleWords.map(word => `<span class="word">${word}</span>`).join(' ');
        
        // Get all title word spans
        const titleWordSpans = title.querySelectorAll('.word');
        
        // Animate title words one by one
        titleWordSpans.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * 150); // 150ms delay between each word
        });
        
        // After all title words are animated, fade in the body
        const titleAnimationTime = titleWordSpans.length * 150 + 400; // word delays + animation duration
        
        setTimeout(() => {
            body.classList.add('fade-in');
        }, titleAnimationTime);
    }
    
    function runCaseStudyEnterAnimations() {
        // Run the hero animation
        animateHeroContent();

        // Ensure scroll-based fades are initialized now that content is visible
        initializeContentVisibility();
        handleHeroScroll();
    }

    // Run animation on page load (unless a password gate is active)
    if (!isPasswordGateActive()) {
        runCaseStudyEnterAnimations();
    }

    // If password-protected, run animations right after unlock
    window.addEventListener('caseStudyUnlocked', () => {
        runCaseStudyEnterAnimations();
    });
    
    // Before/After Image Slider
    function initBeforeAfterSlider() {
        const slider = document.querySelector('.before-after-slider');
        if (!slider) return;
        
        const handle = slider.querySelector('.slider-handle');
        const afterWrapper = slider.querySelector('.after-image-wrapper');
        const container = slider.querySelector('.before-after-container');
        const beforeImage = slider.querySelector('.before-image');
        let isDragging = false;
        
        // Set after wrapper height to match before image and ensure images maintain aspect ratio
        function setHeights() {
            const afterImage = afterWrapper.querySelector('.after-image');
            
            function updateHeights() {
                if (beforeImage.complete && afterImage.complete) {
                    const beforeHeight = beforeImage.offsetHeight;
                    const containerWidth = container.offsetWidth;
                    
                    // Set after wrapper height to match before image exactly
                    afterWrapper.style.height = beforeHeight + 'px';
                    afterWrapper.style.top = '0';
                    afterWrapper.style.left = '0';
                    
                    // Set after image to match container width (100% of wrapper, which is 50% of container)
                    // This ensures it shows at natural size, not zoomed
                    afterImage.style.width = containerWidth + 'px';
                    afterImage.style.height = 'auto';
                    afterImage.style.top = '0';
                }
            }
            
            if (beforeImage.complete && afterImage.complete) {
                updateHeights();
            } else {
                let beforeLoaded = beforeImage.complete;
                let afterLoaded = afterImage.complete;
                
                if (!beforeLoaded) {
                    beforeImage.addEventListener('load', () => {
                        beforeLoaded = true;
                        if (afterLoaded) updateHeights();
                    });
                }
                
                if (!afterLoaded) {
                    afterImage.addEventListener('load', () => {
                        afterLoaded = true;
                        if (beforeLoaded) updateHeights();
                    });
                }
            }
        }
        setHeights();
        window.addEventListener('resize', setHeights);
        
        const beforeLabel = slider.querySelector('.before-label');
        const afterLabel = slider.querySelector('.after-label');
        
        function updateSlider(position) {
            const percent = Math.max(0, Math.min(100, position));
            handle.style.left = percent + '%';
            afterWrapper.style.width = percent + '%';
            
            // Show/hide labels based on slider position
            // Show "Before" when slider is more to the right (showing more before image)
            // Show "After" when slider is more to the left (showing more after image)
            if (percent > 50) {
                // More before image visible
                beforeLabel.style.opacity = '1';
                afterLabel.style.opacity = '0';
            } else {
                // More after image visible
                beforeLabel.style.opacity = '0';
                afterLabel.style.opacity = '1';
            }
        }
        
        function handleMouseMove(e) {
            if (!isDragging) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
            e.preventDefault();
        }
        
        // Also allow clicking anywhere on the slider to move it
        container.addEventListener('click', (e) => {
            if (e.target === handle || e.target.closest('.slider-handle')) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        });
        
        function handleMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        // Touch support
        function handleTouchMove(e) {
            if (!isDragging) return;
            const rect = container.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        }
        
        function handleTouchEnd() {
            isDragging = false;
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        }
        
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        });
        
        // Initialize to 50%
        updateSlider(50);
    }
    
    // Initialize slider
    initBeforeAfterSlider();
});
