// DriveGo Counter Animation and Enhanced Interactions
class CounterAnimation {
    constructor() {
        this.counters = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupObserver();
        this.findCounters();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    this.animateCounter(counter);
                    this.observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
    }

    findCounters() {
        const counterElements = document.querySelectorAll('[data-counter]');
        counterElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target);
                element.classList.add('counter-complete');
            }
        };
        
        requestAnimationFrame(animate);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Enhanced Theme Integration
class EnhancedThemeSystem {
    constructor() {
        this.currentTheme = localStorage.getItem('drivego-theme') || 'gruvbox';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateCustomElements();
        });
    }

    updateCustomElements() {
        // Update any custom styled elements that need theme-specific adjustments
        const customElements = document.querySelectorAll('.theme-dependent');
        customElements.forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }
}

// Enhanced Form Interactions
class FormEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceInputs();
        this.enhanceSelects();
        this.enhanceTextareas();
    }

    enhanceInputs() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"]');
        inputs.forEach(input => {
            this.addFloatingLabel(input);
            this.addFocusEffects(input);
        });
    }

    enhanceSelects() {
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            this.addSelectAnimation(select);
        });
    }

    enhanceTextareas() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addTextareaEffects(textarea);
        });
    }

    addFloatingLabel(input) {
        if (input.placeholder) {
            const wrapper = document.createElement('div');
            wrapper.className = 'floating-input-wrapper';
            
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            
            input.placeholder = '';
            
            // Add event listeners
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
            
            // Check initial value
            if (input.value) {
                label.classList.add('active');
            }
        }
    }

    addFocusEffects(input) {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-focused');
        });
    }

    addSelectAnimation(select) {
        select.addEventListener('change', () => {
            select.classList.add('select-changed');
            setTimeout(() => {
                select.classList.remove('select-changed');
            }, 300);
        });
    }

    addTextareaEffects(textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    new CounterAnimation();
    new EnhancedThemeSystem();
    new FormEnhancements();
    
    // Add stagger animations to cards
    const cards = document.querySelectorAll('.card, .feature-card, .route-card, .community-card, .service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
    
    // Add scroll animations
    const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-slide-in-left, .animate-slide-in-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
            }
        });
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        if (element.classList.contains('animate-slide-up')) {
            element.style.transform = 'translateY(30px)';
        } else if (element.classList.contains('animate-slide-in-left')) {
            element.style.transform = 'translateX(-30px)';
        } else if (element.classList.contains('animate-slide-in-right')) {
            element.style.transform = 'translateX(30px)';
        }
        observer.observe(element);
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CounterAnimation, EnhancedThemeSystem, FormEnhancements };
}