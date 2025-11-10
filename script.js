// ========================================
// DOM CONTENT LOADED
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        }
    });

    // Close mobile menu when clicking a link
    if (navLinks) {
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // ========================================
    // STICKY NAVBAR WITH SCROLL EFFECTS
    // ========================================

    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.slide-in-left, .slide-in-right, .slide-in-up, .fade-in-up, .team-card-modern, .why-card, .stat-item'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ========================================
    // STAGGERED ANIMATIONS WITH DELAY
    // ========================================

    const cardsWithDelay = document.querySelectorAll('[data-delay]');

    const delayObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Unobserve after animation
                delayObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cardsWithDelay.forEach(card => {
        delayObserver.observe(card);
    });

    // ========================================
    // PARALLAX EFFECT FOR HERO & SECTIONS
    // ========================================

    const parallaxSections = document.querySelectorAll('.parallax');

    if (parallaxSections.length > 0 && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;

            parallaxSections.forEach(section => {
                const rect = section.getBoundingClientRect();

                // Only apply parallax when section is in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (scrolled - section.offsetTop) * 0.5;
                    section.style.backgroundPositionY = offset + 'px';
                }
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                company: document.getElementById('company').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service') ? document.getElementById('service').value : '',
                message: document.getElementById('message').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Phone validation (basic)
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (formData.phone && !phoneRegex.test(formData.phone)) {
                showFormMessage('Please enter a valid phone number.', 'error');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success
                showFormMessage('Thank you! We\'ll get back to you shortly.', 'success');
                contactForm.reset();

                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;

                // Here you would typically send the data to your server:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(formData)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     showFormMessage('Thank you! We\'ll get back to you shortly.', 'success');
                //     contactForm.reset();
                // })
                // .catch(error => {
                //     showFormMessage('Sorry, there was an error. Please try again.', 'error');
                // })
                // .finally(() => {
                //     submitButton.textContent = originalButtonText;
                //     submitButton.disabled = false;
                // });
            }, 1500);
        });
    }

    // Form message helper
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;

        // Insert message at the top of the form
        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================

    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        background-color: #009345;
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 24px;
        font-weight: 700;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 999;
        box-shadow: 0 4px 16px rgba(0, 147, 69, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effects
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#007535';
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 8px 24px rgba(0, 147, 69, 0.4)';
    });

    backToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#009345';
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 16px rgba(0, 147, 69, 0.3)';
    });

    // ========================================
    // PAGE LOAD ANIMATION
    // ========================================

    // Fade in body on load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // ========================================
    // IMAGE LAZY LOADING (FALLBACK)
    // ========================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // ENHANCED HOVER EFFECTS FOR IMAGES
    // ========================================

    const imageWrappers = document.querySelectorAll('.image-wrapper');

    imageWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });

        wrapper.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================

    // Debounce scroll events
    let scrollTimeout;
    let lastScrollTime = Date.now();
    const scrollThrottle = 16; // ~60fps

    window.addEventListener('scroll', function() {
        const now = Date.now();

        if (now - lastScrollTime >= scrollThrottle) {
            lastScrollTime = now;

            // Clear timeout if exists
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set timeout for final scroll position
            scrollTimeout = setTimeout(function() {
                // Final scroll position handling
            }, 150);
        }
    }, { passive: true });

    // ========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================

    // Add focus visible class for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Add CSS for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        body:not(.keyboard-nav) *:focus {
            outline: none;
        }

        .keyboard-nav *:focus {
            outline: 2px solid #009345;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // CONSOLE MESSAGE
    // ========================================

    console.log('%c🚛 Melons Logistics', 'color: #009345; font-size: 24px; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'color: #2c3e50; font-size: 14px;');

});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
