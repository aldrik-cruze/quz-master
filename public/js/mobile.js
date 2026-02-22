// Mobile optimizations and fixes
// Works for Android 9-17 and iOS

(function() {
    'use strict';

    // Fix for mobile viewport height (address bar issues)
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set initial viewport height
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });

    // Prevent iOS Safari elastic scroll on quiz page
    if (document.body.classList.contains('quiz-page') || 
        window.location.pathname.includes('quiz.html')) {
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.quiz-content') === null) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Add touch feedback for buttons
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = document.querySelectorAll('.btn, .option-card, .topic-card-large');
        
        buttons.forEach(function(button) {
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.style.opacity = '1';
            }, { passive: true });
        });
    });

    // Prevent double-tap zoom on buttons
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Detect Android version for specific fixes
    function getAndroidVersion() {
        const ua = navigator.userAgent.toLowerCase();
        const match = ua.match(/android\s([0-9\.]*)/);
        return match ? parseFloat(match[1]) : false;
    }

    const androidVersion = getAndroidVersion();
    
    // Apply Android-specific fixes
    if (androidVersion) {
        document.documentElement.classList.add('android');
        document.documentElement.classList.add('android-' + Math.floor(androidVersion));
        
        // Fix for Android 9-10 scroll issues
        if (androidVersion >= 9 && androidVersion <= 10) {
            document.body.style.overflow = 'auto';
            document.body.style.webkitOverflowScrolling = 'touch';
        }
    }

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.documentElement.classList.add('ios');
    }

    // Improve touch scrolling performance
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Fix for sticky :hover on mobile
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function() {}, true);
    }

    // Prevent zoom on input focus for iOS
    if (isIOS) {
        const addMaximumScaleToMetaViewport = function() {
            const el = document.querySelector('meta[name=viewport]');
            if (el !== null) {
                let content = el.getAttribute('content');
                const re = /maximum\-scale=[0-9\.]+/g;
                if (re.test(content)) {
                    content = content.replace(re, 'maximum-scale=5.0');
                } else {
                    content = [content, 'maximum-scale=5.0'].join(', ');
                }
                el.setAttribute('content', content);
            }
        };

        const disableZoom = function() {
            addMaximumScaleToMetaViewport();
        };

        // Re-enable zoom after input focus
        const checkInputFocus = function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                disableZoom();
            }
        };

        document.addEventListener('touchstart', checkInputFocus, true);
    }

    // Service Worker registration for offline capability (optional)
    if ('serviceWorker' in navigator) {
        // Uncomment to enable offline support
        // navigator.serviceWorker.register('/sw.js').catch(function() {});
    }

    // Handle Android back button (if in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        window.addEventListener('popstate', function(event) {
            // Handle navigation
            if (document.referrer === '') {
                window.location.href = '/index.html';
            }
        });
    }

    // Optimize images for mobile
    if (window.innerWidth <= 768) {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if (img.hasAttribute('data-mobile-src')) {
                img.src = img.getAttribute('data-mobile-src');
            }
        });
    }

    // Fast click implementation (reduces 300ms delay on older Android)
    function FastClick(element) {
        this.element = element;
        this.init();
    }

    FastClick.prototype.init = function() {
        const self = this;
        this.element.addEventListener('touchstart', function(e) {
            self.touchStartX = e.touches[0].pageX;
            self.touchStartY = e.touches[0].pageY;
            self.touchStartTime = Date.now();
        });

        this.element.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            const touchTime = touchEndTime - self.touchStartTime;
            
            if (touchTime < 200) {
                e.preventDefault();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                e.target.dispatchEvent(clickEvent);
            }
        });
    };

    // Apply FastClick to buttons on Android < 5.0
    if (androidVersion && androidVersion < 5.0) {
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('button, .btn, a');
            buttons.forEach(function(btn) {
                new FastClick(btn);
            });
        });
    }

    // Log device info for debugging (remove in production)
    console.log('Mobile Optimizations Loaded');
    console.log('Device:', {
        userAgent: navigator.userAgent,
        android: androidVersion || 'Not Android',
        iOS: isIOS,
        screenSize: window.innerWidth + 'x' + window.innerHeight,
        pixelRatio: window.devicePixelRatio
    });

})();
