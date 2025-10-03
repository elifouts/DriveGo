// Theme Controller for DriveGo
class ThemeController {
    constructor() {
        this.themes = {
            gruvbox: {
                name: 'Gruvbox',
                icon: '🌲',
                description: 'Warm retro vibes'
            },
            nord: {
                name: 'Nord',
                icon: '❄️',
                description: 'Arctic polar theme'
            },
            evergreen: {
                name: 'Evergreen',
                icon: '🌿',
                description: 'Natural forest theme'
            },
            cyberpunk: {
                name: 'Cyberpunk',
                icon: '🤖',
                description: 'Neon future vibes'
            },
            minimal: {
                name: 'Minimal',
                icon: '⚪',
                description: 'Clean and simple'
            }
        };
        
        this.currentTheme = localStorage.getItem('drivego-theme') || 'gruvbox';
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.createThemeToggle();
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }
    
    createThemeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.innerHTML = '🎨';
        toggleButton.title = 'Change Theme';
        toggleButton.id = 'theme-toggle';
        
        document.body.appendChild(toggleButton);
    }
    
    createThemeSelector() {
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.id = 'theme-selector';
        
        let optionsHTML = '<h5 style="margin-bottom: 15px; color: var(--text_color);">Choose Theme</h5>';
        
        Object.entries(this.themes).forEach(([key, theme]) => {
            const isActive = key === this.currentTheme ? 'active' : '';
            optionsHTML += `
                <div class="theme-option ${isActive}" data-theme="${key}">
                    <div class="theme-preview ${key}"></div>
                    <div>
                        <div style="font-weight: bold;">${theme.icon} ${theme.name}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">${theme.description}</div>
                    </div>
                </div>
            `;
        });
        
        selector.innerHTML = optionsHTML;
        document.body.appendChild(selector);
    }
    
    bindEvents() {
        const toggleButton = document.getElementById('theme-toggle');
        const selector = document.getElementById('theme-selector');
        
        toggleButton.addEventListener('click', () => {
            this.toggleSelector();
        });
        
        // Close selector when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleButton.contains(e.target) && !selector.contains(e.target)) {
                this.closeSelector();
            }
        });
        
        // Theme option clicks
        selector.addEventListener('click', (e) => {
            const option = e.target.closest('.theme-option');
            if (option) {
                const theme = option.dataset.theme;
                this.selectTheme(theme);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSelector();
            }
        });
    }
    
    toggleSelector() {
        if (this.isOpen) {
            this.closeSelector();
        } else {
            this.openSelector();
        }
    }
    
    openSelector() {
        const selector = document.getElementById('theme-selector');
        selector.classList.add('active');
        this.isOpen = true;
    }
    
    closeSelector() {
        const selector = document.getElementById('theme-selector');
        selector.classList.remove('active');
        this.isOpen = false;
    }
    
    selectTheme(theme) {
        if (this.themes[theme]) {
            this.applyTheme(theme);
            this.updateActiveOption(theme);
            this.closeSelector();
            
            // Save to localStorage
            localStorage.setItem('drivego-theme', theme);
            this.currentTheme = theme;
            
            // Show confirmation toast
            this.showThemeToast(this.themes[theme].name);
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update fog effect colors if it exists
        if (window.fogEffect) {
            this.updateFogColors(theme);
        }
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, themeData: this.themes[theme] }
        }));
    }
    
    updateFogColors(theme) {
        const themeColors = {
            gruvbox: ['#458588', '#83a598', '#a89984'],
            nord: ['#5e81ac', '#88c0d0', '#81a1c1'],
            evergreen: ['#4caf50', '#7cb342', '#8bc34a'],
            cyberpunk: ['#ff00ff', '#00ffff', '#e94560'],
            minimal: ['#007bff', '#6c757d', '#adb5bd']
        };
        
        if (window.fogEffect && themeColors[theme]) {
            window.fogEffect.updateColors(themeColors[theme]);
        }
    }
    
    updateActiveOption(theme) {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            }
        });
    }
    
    showThemeToast(themeName) {
        // Remove existing toast
        const existingToast = document.getElementById('theme-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'theme-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent_color);
            color: var(--default_color);
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1001;
            animation: toastSlideIn 0.3s ease-out;
        `;
        
        toast.textContent = `Theme changed to ${themeName}`;
        document.body.appendChild(toast);
        
        // Auto remove after 2 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 2000);
    }
    
    // Method to get current theme info
    getCurrentTheme() {
        return {
            key: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    }
}

// Toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
@keyframes toastSlideIn {
    from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

@keyframes toastSlideOut {
    from {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    to {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(toastStyles);

// Initialize theme controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
    
    // Listen for theme changes to update other components
    document.addEventListener('themeChanged', (e) => {
        console.log(`Theme changed to: ${e.detail.theme}`);
        
        // You can add more theme-specific functionality here
        // For example, updating chart colors, map styles, etc.
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeController;
}