// Unified Animation Controller for DriveGo
class UnifiedAnimationController {
    constructor() {
        this.observers = new Map();
        this.lastScrollY = 0;
        this.isScrolling = false;
        this.scrollDirection = 'down';
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHeaderBehavior();
        this.setupMobileMenu();
        this.setupButtonAnimations();
        this.setupCounterAnimations();
        this.setupParallaxEffect();
        this.bindEvents();
        
        console.log('Unified Animation Controller initialized');
    }

    setupScrollAnimations() {
        // Main scroll observer for elements
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Auto-unobserve after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        scrollObserver.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.animateOnce === 'false') {
                    entry.target.classList.remove('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Stagger observer for grid items
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.grid-item-animated, .list-item-animated');
                    this.animateStagger(items);
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        // Apply observers
        document.querySelectorAll('.animate-on-scroll, .section-animated').forEach(el => {
            scrollObserver.observe(el);
        });

        document.querySelectorAll('[data-stagger="true"]').forEach(el => {
            staggerObserver.observe(el);
        });

        this.observers.set('scroll', scrollObserver);
        this.observers.set('stagger', staggerObserver);
    }

    setupHeaderBehavior() {
        const header = document.getElementById('main-header');
        if (!header) return;

        let lastScrollY = 0;
        let scrollTimeout;

        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            
            // Add scrolled class
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            }

            lastScrollY = currentScrollY;

            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Show header after scroll stops
            scrollTimeout = setTimeout(() => {
                header.classList.remove('hidden');
            }, 150);
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 10));
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileAuthBtn = document.getElementById('mobile-auth-button');
        const authBtn = document.getElementById('auth-button');

        if (!mobileMenuBtn || !mobileNav) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuBtn.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        // Sync auth buttons
        if (mobileAuthBtn && authBtn) {
            const syncAuthButtons = () => {
                mobileAuthBtn.innerHTML = authBtn.innerHTML;
            };
            
            // Sync initially and on changes
            syncAuthButtons();
            
            // Use MutationObserver to watch for auth button changes
            const observer = new MutationObserver(syncAuthButtons);
            observer.observe(authBtn, { childList: true, subtree: true });
        }
    }

    openMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNav = document.getElementById('mobile-nav');
        
        mobileMenuBtn.classList.add('active');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNav = document.getElementById('mobile-nav');
        
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupButtonAnimations() {
        // Add animated classes to buttons
        document.querySelectorAll('.btn, .cta-btn, .auth-btn').forEach(btn => {
            btn.classList.add('btn-animated');
        });

        // Add animated classes to cards
        document.querySelectorAll('.card, .feature-card, .route-card').forEach(card => {
            card.classList.add('card-animated');
        });

        // Add animated classes to icons
        document.querySelectorAll('.fas, .far, .fab').forEach(icon => {
            if (!icon.closest('button')) {
                icon.classList.add('icon-animated');
                
                // Randomly assign hover effects
                const effects = ['icon-bounce', 'icon-pulse', 'icon-spin'];
                const effect = effects[Math.floor(Math.random() * effects.length)];
                icon.classList.add(effect);
            }
        });
    }

    setupCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-counter]').forEach(el => {
            counterObserver.observe(el);
        });

        this.observers.set('counter', counterObserver);
    }

    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-animated');
        
        if (parallaxElements.length === 0) return;

        const handleMouseMove = this.throttle((e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const deltaX = (clientX - centerX) / centerX;
            const deltaY = (clientY - centerY) / centerY;

            parallaxElements.forEach((el, index) => {
                const intensity = (index + 1) * 0.5;
                const x = deltaX * intensity;
                const y = deltaY * intensity;
                
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, 16);

        document.addEventListener('mousemove', handleMouseMove);
    }

    animateStagger(items, delay = 100) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * delay);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = parseInt(element.textContent) || 0;
        
        let current = start;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target.toLocaleString();
                element.classList.add('counter-animated');
            } else {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Utility method to set active navigation
    setActiveNavigation(currentPage) {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Method to manually trigger animations
    triggerAnimation(selector, animationType = 'slide-up') {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((el, index) => {
            el.classList.add('animate-on-scroll', `animate-${animationType}`);
            
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 100);
        });
    }

    // Method to reset animations
    resetAnimations(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            el.classList.remove('animated');
        });
    }

    bindEvents() {
        // Update active navigation on page load
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.setActiveNavigation(currentPage);

        // Handle visibility change to pause animations
        document.addEventListener('visibilitychange', () => {
            const animatedElements = document.querySelectorAll('.float-animated, .float-animated-alt');
            
            if (document.hidden) {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
            } else {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }

    // Utility methods
    throttle(func, limit) {
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

    debounce(func, wait) {
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

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedAnimationController = new UnifiedAnimationController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.unifiedAnimationController) {
        window.unifiedAnimationController.destroy();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedAnimationController;
}