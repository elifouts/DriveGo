// Settings Page Controller for DriveGo
class SettingsController {
    constructor() {
        this.settings = {
            theme: 'gruvbox',
            reducedMotion: false,
            autoplayVideos: true,
            distanceUnits: 'metric',
            mapStyle: 'terrain',
            routeAlerts: true,
            weeklyDigest: true,
            communityUpdates: false
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.initializeForm();
    }

    loadSettings() {
        // Load from localStorage
        const stored = localStorage.getItem('drivego-settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
        
        // Load current theme from localStorage (simple theme system)
        const currentTheme = localStorage.getItem('theme') || 'midnight';
        this.settings.theme = currentTheme;
        
        // Also check for the selected-theme key for backwards compatibility
        const legacyTheme = localStorage.getItem('selected-theme');
        if (legacyTheme && !localStorage.getItem('theme')) {
            this.settings.theme = legacyTheme;
            localStorage.setItem('theme', legacyTheme);
        }
        
        // Populate theme grid
        this.createThemeGrid();
    }

    saveSettings() {
        localStorage.setItem('drivego-settings', JSON.stringify(this.settings));
        
        // Apply settings immediately
        this.applySettings();
        
        // Show success message
        this.showSuccessMessage();
    }

    applySettings() {
        // Apply reduced motion
        if (this.settings.reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        } else {
            document.documentElement.style.removeProperty('--animation-duration');
            document.documentElement.style.removeProperty('--transition-duration');
        }
        
        // Apply theme using simple theme system
        if (typeof setTheme === 'function' && this.settings.theme) {
            setTheme(this.settings.theme);
        }
        
        // Store in user profile if logged in
        if (window.firebaseAuth && window.firebaseAuth.isSignedIn()) {
            window.firebaseAuth.updateProfile({ 
                preferences: this.settings 
            }).catch(error => {
                console.warn('Failed to save settings to profile:', error);
            });
        }
    }

    initializeForm() {
        // Set form values based on current settings
        this.setFormValue('reduced-motion', this.settings.reducedMotion);
        this.setFormValue('autoplay-videos', this.settings.autoplayVideos);
        this.setFormValue('distance-units', this.settings.distanceUnits);
        this.setFormValue('map-style', this.settings.mapStyle);
        this.setFormValue('route-alerts', this.settings.routeAlerts);
        this.setFormValue('weekly-digest', this.settings.weeklyDigest);
        this.setFormValue('community-updates', this.settings.communityUpdates);
    }

    setFormValue(id, value) {
        const element = document.getElementById(id);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = value;
        } else {
            element.value = value;
        }
    }

    getFormValue(id) {
        const element = document.getElementById(id);
        if (!element) return null;
        
        if (element.type === 'checkbox') {
            return element.checked;
        } else {
            return element.value;
        }
    }

    createThemeGrid() {
        const themeGrid = document.getElementById('theme-grid');
        if (!themeGrid) return;

        // Define themes matching our simple theme system
        const themes = {
            midnight: { name: 'Midnight', description: 'Deep blues with cyan accents', colors: ['#0f1419', '#06b6d4', '#1e293b'] },
            nord: { name: 'Nordic', description: 'Arctic blues inspired by Aurora', colors: ['#1a1d23', '#67e8f9', '#2d3748'] },
            forest: { name: 'Forest', description: 'Natural greens with earthy tones', colors: ['#0f1a14', '#10b981', '#1f2937'] },
            cyberpunk: { name: 'Cyberpunk', description: 'Neon purples and electric blues', colors: ['#0c0c0f', '#8b5cf6', '#1e1b3a'] },
            gruvbox: { name: 'Gruvbox', description: 'Warm retro oranges and yellows', colors: ['#1d2021', '#fabd2f', '#3c3836'] },
            noctua: { name: 'Noctua', description: 'Premium browns with golden accents', colors: ['#1a1612', '#d4a574', '#2d2721'] },
            dracula: { name: 'Dracula', description: 'Gothic purples with vibrant highlights', colors: ['#282a36', '#bd93f9', '#44475a'] },
            everforest: { name: 'Everforest', description: 'Soft forest tones with muted pastels', colors: ['#2d353b', '#a7c080', '#404c51'] },
            crimson: { name: 'Crimson', description: 'Deep reds with warm orange accents', colors: ['#2c1810', '#ef4444', '#451a03'] }
        };

        const currentTheme = localStorage.getItem('theme') || localStorage.getItem('selected-theme') || 'midnight';

        themeGrid.innerHTML = '';
        
        Object.entries(themes).forEach(([themeId, theme]) => {
            const themeCard = document.createElement('div');
            themeCard.className = `theme-card ${currentTheme === themeId ? 'active' : ''}`;
            themeCard.dataset.theme = themeId;
            
            themeCard.innerHTML = `
                <div class="theme-preview">
                    <div class="color-swatch" style="background: ${theme.colors[0]}"></div>
                    <div class="color-swatch" style="background: ${theme.colors[1]}"></div>
                    <div class="color-swatch" style="background: ${theme.colors[2]}"></div>
                </div>
                <div class="theme-info">
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-description">${theme.description}</div>
                </div>
            `;
            
            themeCard.addEventListener('click', () => {
                // Remove active class from all cards
                themeGrid.querySelectorAll('.theme-card').forEach(card => {
                    card.classList.remove('active');
                });
                
                // Add active class to clicked card
                themeCard.classList.add('active');
                
                // Apply theme using simple theme system
                if (typeof setTheme === 'function') {
                    setTheme(themeId);
                }
                
                // Update settings
                this.settings.theme = themeId;
                this.saveSettings();
            });
            
            themeGrid.appendChild(themeCard);
        });
    }

    bindEvents() {
        // Save button
        const saveButton = document.getElementById('save-settings');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.handleSave();
            });
        }

        // Form changes
        const formElements = [
            'reduced-motion',
            'autoplay-videos', 
            'distance-units',
            'map-style',
            'route-alerts',
            'weekly-digest',
            'community-updates'
        ];

        formElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.handleFormChange();
                });
            }
        });

        // Listen for theme changes from theme manager
        document.addEventListener('themeChanged', (e) => {
            this.settings.theme = e.detail.theme;
        });

        // Listen for auth state changes to sync with user profile
        document.addEventListener('authStateChanged', (e) => {
            if (e.detail.user && e.detail.user.preferences) {
                this.settings = { ...this.settings, ...e.detail.user.preferences };
                this.initializeForm();
                this.applySettings();
            }
        });
    }

    handleFormChange() {
        // Update settings object
        this.settings.reducedMotion = this.getFormValue('reduced-motion');
        this.settings.autoplayVideos = this.getFormValue('autoplay-videos');
        this.settings.distanceUnits = this.getFormValue('distance-units');
        this.settings.mapStyle = this.getFormValue('map-style');
        this.settings.routeAlerts = this.getFormValue('route-alerts');
        this.settings.weeklyDigest = this.getFormValue('weekly-digest');
        this.settings.communityUpdates = this.getFormValue('community-updates');
        
        // Apply certain settings immediately
        if (this.settings.reducedMotion !== this.getStoredSetting('reducedMotion')) {
            this.applySettings();
        }
    }

    handleSave() {
        // Update all settings from form
        this.handleFormChange();
        
        // Save to storage
        this.saveSettings();
    }

    getStoredSetting(key) {
        const stored = localStorage.getItem('drivego-settings');
        if (stored) {
            const settings = JSON.parse(stored);
            return settings[key];
        }
        return null;
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    }

    // Public methods for other scripts to use
    getSetting(key) {
        return this.settings[key];
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    resetToDefaults() {
        // Reset to default settings
        this.settings = {
            theme: 'gruvbox',
            reducedMotion: false,
            autoplayVideos: true,
            distanceUnits: 'metric',
            mapStyle: 'terrain',
            routeAlerts: true,
            weeklyDigest: true,
            communityUpdates: false
        };
        
        this.initializeForm();
        this.saveSettings();
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'drivego-settings.json';
        link.click();
    }

    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.settings = { ...this.settings, ...imported };
                this.initializeForm();
                this.saveSettings();
                this.showSuccessMessage();
            } catch (error) {
                console.error('Failed to import settings:', error);
                alert('Failed to import settings. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupReducedMotion();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }

    setupReducedMotion() {
        // Check system preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduce-motion');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }
        };
        
        handleMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
    }

    setupKeyboardNavigation() {
        // Enhanced tab navigation for theme cards
        document.querySelectorAll('.theme-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${card.dataset.theme} theme`);
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Ensure proper focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .theme-card:focus {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
            }
            
            .toggle-switch:focus-within {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
                border-radius: 30px;
            }
            
            .select-custom:focus {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsController = new SettingsController();
    window.accessibilityManager = new AccessibilityManager();
    
    console.log('Settings controller initialized');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SettingsController, AccessibilityManager };
}