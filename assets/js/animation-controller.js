// Enhanced Animations Controller for DriveGo
class AnimationController {
    constructor() {
        this.observers = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollAnimations();
        this.setupHoverEnhancements();
        this.setupStaggerAnimations();
        this.setupPerformanceOptimizations();
        
        this.isInitialized = true;
        console.log('Enhanced animations initialized');
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Optional: unobserve after animation triggers
                    if (entry.target.dataset.animateOnce === 'true') {
                        scrollObserver.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            scrollObserver.observe(el);
        });

        this.observers.push(scrollObserver);
    }

    setupStaggerAnimations() {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        document.querySelectorAll('.stagger-animation').forEach(el => {
            staggerObserver.observe(el);
        });

        this.observers.push(staggerObserver);
    }

    setupHoverEnhancements() {
        // Enhanced button effects
        document.querySelectorAll('.enhanced-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.setProperty('--hover-intensity', '1');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.setProperty('--hover-intensity', '0');
            });
        });

        // Enhanced icon effects with random animation selection
        document.querySelectorAll('.enhanced-icon').forEach(icon => {
            const animations = ['spin-hover', 'bounce-hover', 'shake-hover'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            
            // Only add if no specific animation class is already present
            if (!icon.classList.contains('spin-hover') && 
                !icon.classList.contains('bounce-hover') && 
                !icon.classList.contains('shake-hover')) {
                icon.classList.add(randomAnimation);
            }
        });
    }

    setupPerformanceOptimizations() {
        // Add performance enhancement classes to animated elements
        const animatedElements = document.querySelectorAll(`
            .float-animation,
            .float-animation-alt,
            .pulse-glow,
            .pulse-border,
            .enhanced-card,
            .enhanced-btn
        `);

        animatedElements.forEach(el => {
            el.classList.add('enhance-performance');
        });

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    pauseAnimations() {
        const style = document.createElement('style');
        style.id = 'pause-animations';
        style.textContent = `
            *, *::before, *::after {
                animation-play-state: paused !important;
            }
        `;
        document.head.appendChild(style);
    }

    resumeAnimations() {
        const pauseStyle = document.getElementById('pause-animations');
        if (pauseStyle) {
            pauseStyle.remove();
        }
    }

    // Method to add floating animation to specific elements
    addFloatingAnimation(selector, type = 'upDown') {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            const animationClass = type === 'leftRight' ? 'float-animation-alt' : 'float-animation';
            el.classList.add(animationClass);
            
            // Add slight delay for multiple elements
            if (index > 0) {
                el.style.animationDelay = `${index * 0.5}s`;
            }
        });
    }

    // Method to add pulse animation to specific elements
    addPulseAnimation(selector, type = 'glow') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const animationClass = type === 'border' ? 'pulse-border' : 'pulse-glow';
            el.classList.add(animationClass);
        });
    }

    // Method to trigger slide-in animations
    triggerSlideIn(selector, direction = 'bottom') {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add(`slide-in-${direction}`);
            }, index * 100);
        });
    }

    // Method to create typewriter effect
    createTypewriter(element, text, speed = 50) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        element.textContent = '';
        element.classList.add('typewriter-text');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }

    // Method to enhance existing elements with animations
    enhanceElement(selector, enhancements = {}) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            if (enhancements.float) {
                el.classList.add('float-animation');
            }
            
            if (enhancements.pulse) {
                el.classList.add('pulse-glow');
            }
            
            if (enhancements.hover) {
                el.classList.add('enhanced-btn');
            }
            
            if (enhancements.scroll) {
                el.classList.add('animate-on-scroll');
            }
            
            if (enhancements.stagger) {
                el.classList.add('stagger-animation');
            }
        });
    }

    // Method to create custom animation sequences
    createSequence(elements, animations, delays = []) {
        elements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                const delay = delays[index] || index * 200;
                setTimeout(() => {
                    if (animations[index]) {
                        el.classList.add(animations[index]);
                    }
                }, delay);
            }
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Example usage - enhance common DriveGo elements
    setTimeout(() => {
        // Add floating animation to feature cards
        window.animationController.addFloatingAnimation('.hero-feature-card', 'upDown');
        
        // Add pulse to call-to-action buttons
        window.animationController.addPulseAnimation('.cta-button, .btn-primary', 'glow');
        
        // Enhance navigation items
        window.animationController.enhanceElement('.navbar-nav .nav-link', {
            hover: true,
            scroll: true
        });
        
        // Add stagger animation to route cards if they exist
        const routeCards = document.querySelector('.route-cards-container');
        if (routeCards) {
            routeCards.classList.add('stagger-animation');
        }
    }, 100);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationController) {
        window.animationController.destroy();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}