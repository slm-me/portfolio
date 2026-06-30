// ==================== BROWSER DETECTION ====================
(function() {
    'use strict';
    
    // Function to detect browser
    function getBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'unknown';
        
        // Check for Internet Explorer
        if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
            browser = 'ie';
        }
        // Check for old Edge (EdgeHTML)
        else if (userAgent.indexOf('Edge/') !== -1 || userAgent.indexOf('Spartan') !== -1) {
            browser = 'edge-old';
        }
        // Check for new Edge (Chromium-based)
        else if (userAgent.indexOf('Edg/') !== -1) {
            browser = 'edge';
        }
        // Check for Chrome
        else if (userAgent.indexOf('Chrome/') !== -1 && userAgent.indexOf('Edg/') === -1) {
            browser = 'chrome';
        }
        // Check for Firefox
        else if (userAgent.indexOf('Firefox/') !== -1) {
            browser = 'firefox';
        }
        // Check for Safari
        else if (userAgent.indexOf('Safari/') !== -1 && userAgent.indexOf('Chrome/') === -1) {
            browser = 'safari';
        }
        // Check for Opera
        else if (userAgent.indexOf('OPR/') !== -1 || userAgent.indexOf('Opera/') !== -1) {
            browser = 'opera';
        }
        
        return browser;
    }
    
    // Function to check if browser is supported
    function isBrowserSupported() {
        const browser = getBrowser();
        const unsupportedBrowsers = ['ie', 'edge-old', 'edge'];
        
        return !unsupportedBrowsers.includes(browser);
    }
    
    // Function to show warning
    function showBrowserWarning() {
        const warning = document.getElementById('browserWarning');
        if (warning) {
            warning.classList.add('show');
            document.body.classList.add('browser-unsupported');
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            
            // Log to console
            console.warn('Unsupported browser detected. Please use Chrome, Firefox, Opera, Brave, or Vivaldi.');
        }
    }
    
    // Check browser on page load
    if (!isBrowserSupported()) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showBrowserWarning);
        } else {
            showBrowserWarning();
        }
        
        // Disable right-click context menu for unsupported browsers
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            alert('Этот сайт не поддерживается в вашем браузере. Пожалуйста, используйте Chrome, Firefox или другой современный браузер.');
        });
        
        // Stop further script execution for unsupported browsers
        return;
    }
    
})();

// ==================== MAIN SITE FUNCTIONALITY ====================
// Only runs if browser is supported
(function() {
    'use strict';
    
    // Intersection Observer for animations on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class for background animation
                entry.target.classList.add('active');
                
                // Update company name in header
                const companyName = entry.target.dataset.company;
                const companyColor = entry.target.dataset.color;
                updateCurrentCompany(companyName, companyColor);
            }
        });
    }, observerOptions);
    
    // Observe all company sections
    document.querySelectorAll('.company-section').forEach(section => {
        observer.observe(section);
    });
    
    // Function to update current company in header
    function updateCurrentCompany(name, color) {
        const companyNameEl = document.querySelector('.company-name');
        const indicatorEl = document.querySelector('.company-indicator');
        
        if (companyNameEl && name) {
            companyNameEl.style.opacity = '0';
            setTimeout(() => {
                companyNameEl.textContent = name;
                companyNameEl.style.opacity = '0.8';
            }, 150);
        }
        
        if (indicatorEl && color) {
            indicatorEl.style.background = color;
        }
    }
    
    // Scroll Progress Bar
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    // Parallax effect for backgrounds
    function parallaxEffect() {
        const sections = document.querySelectorAll('.company-section');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const background = section.querySelector('.company-background');
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const yPos = -(scrolled * 50);
                background.style.transform = `scale(1.1) translateY(${yPos}px)`;
            }
        });
    }
    
    // Fade-in observer for elements
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeInObserver.observe(el);
    });
    
    // Event Listeners
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        parallaxEffect();
        
        // Hide/show header on scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });
    
    // Initialization
    updateScrollProgress();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Fade-in animation on load
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
})();
