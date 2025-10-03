// Simple, direct theme toggle that works immediately
// console.log('Simple theme toggle loading...');

// Theme definitions that match the CSS exactly
const THEMES = {
    midnight: { name: 'Midnight', cssName: 'midnight' },
    nord: { name: 'Nordic', cssName: 'nord' },
    gruvbox: { name: 'Gruvbox', cssName: 'gruvbox' },
    noctua: { name: 'Noctua', cssName: 'noctua' },
    cyberpunk: { name: 'Cyberpunk', cssName: 'cyberpunk' },
    dracula: { name: 'Dracula', cssName: 'dracula' },
    forest: { name: 'Forest', cssName: 'forest' },
    everforest: { name: 'Everforest', cssName: 'everforest' },
    crimson: { name: 'Crimson', cssName: 'crimson' }
};

const THEME_ORDER = ['midnight', 'nord', 'forest', 'cyberpunk', 'gruvbox', 'noctua', 'dracula', 'everforest', 'crimson'];

function getCurrentTheme() {
    return localStorage.getItem('theme') || 'nord';
}

function setTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) {
        console.error('Theme not found:', themeName);
        return;
    }
    
    // Apply to root element using the correct CSS name
    const root = document.documentElement;
    
    // Nord is now the default theme (:root), so remove data-theme attribute
    if (themeName === 'nord') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', theme.cssName);
    }
    
    // Store the theme key (not CSS name) in localStorage
    localStorage.setItem('theme', themeName);
    
    // Update grid background if available
    if (window.gridBackground && typeof window.gridBackground.updateTheme === 'function') {
        window.gridBackground.updateTheme(theme.cssName);
    }
    
    // Force a style recalculation
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Show subtle theme indicator
    showThemeIndicator(theme.name);
}

function showThemeIndicator(themeName) {
    // Remove any existing indicator
    const existingIndicator = document.querySelector('.theme-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'theme-indicator';
    indicator.textContent = themeName;
    
    document.body.appendChild(indicator);
    
    // Show indicator with animation
    requestAnimationFrame(() => {
        indicator.classList.add('show');
    });
    
    // Hide after 2 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.classList.remove('show');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 400);
        }
    }, 2000);
}

function cycleTheme() {
    const current = getCurrentTheme();
    const currentIndex = THEME_ORDER.indexOf(current);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    const nextTheme = THEME_ORDER[nextIndex];
    
    setTheme(nextTheme);
    return nextTheme;
}

function initializeThemeButtons() {
    // console.log('Initializing simple theme buttons...');
    
    const desktopBtn = document.getElementById('theme-toggle-btn');
    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');
    
    // console.log('Found buttons:', { desktop: !!desktopBtn, mobile: !!mobileBtn });
    
    if (desktopBtn) {
        // Remove any existing listeners
        desktopBtn.onclick = null;
        
        desktopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // console.log('Desktop theme button clicked!');
            
            const newTheme = cycleTheme();
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // console.log('Switched to theme:', newTheme);
        });
        
        // console.log('Desktop theme button initialized');
    }
    
    if (mobileBtn) {
        // Remove any existing listeners
        mobileBtn.onclick = null;
        
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // console.log('Mobile theme button clicked!');
            
            const newTheme = cycleTheme();
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // console.log('Switched to theme:', newTheme);
        });
        
        // console.log('Mobile theme button initialized');
    }
}

// Apply saved theme immediately on script load
function applySavedTheme() {
    const currentTheme = getCurrentTheme();
    const theme = THEMES[currentTheme];
    if (theme) {
        const root = document.documentElement;
        
        // Apply theme to root element
        if (currentTheme === 'midnight') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme.cssName);
        }
        
        // Ensure localStorage persistence
        localStorage.setItem('theme', currentTheme);
        
        // Update grid background if available (with delay for grid initialization)
        setTimeout(() => {
            if (window.gridBackground && typeof window.gridBackground.updateTheme === 'function') {
                window.gridBackground.updateTheme(theme.cssName);
            }
        }, 100);
        
        // Verify theme was applied correctly
        setTimeout(() => {
            verifyThemeApplication(currentTheme);
        }, 200);
    }
}

// Verify theme application and re-apply if necessary
function verifyThemeApplication(expectedTheme) {
    const root = document.documentElement;
    const currentDataTheme = root.getAttribute('data-theme');
    const theme = THEMES[expectedTheme];
    
    if (!theme) return;
    
    const expectedDataTheme = expectedTheme === 'midnight' ? null : theme.cssName;
    
    // If theme doesn't match, re-apply it
    if (currentDataTheme !== expectedDataTheme) {
        if (expectedTheme === 'midnight') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme.cssName);
        }
    }
}

// Apply theme immediately
applySavedTheme();

// Initialize immediately when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        applySavedTheme(); // Re-apply theme after DOM loads
        initializeThemeButtons();
    });
} else {
    applySavedTheme(); // Re-apply theme if DOM already loaded
    initializeThemeButtons();
}

// Also try after a delay in case DOM isn't fully ready
setTimeout(() => {
    applySavedTheme();
    initializeThemeButtons();
}, 100);
setTimeout(() => {
    applySavedTheme();
    initializeThemeButtons();
}, 500);
setTimeout(() => {
    applySavedTheme(); 
    initializeThemeButtons();
}, 1000);

// Set up a theme persistence watcher
setInterval(() => {
    const savedTheme = getCurrentTheme();
    const root = document.documentElement;
    const currentDataTheme = root.getAttribute('data-theme');
    const theme = THEMES[savedTheme];
    
    if (theme) {
        const expectedDataTheme = savedTheme === 'midnight' ? null : theme.cssName;
        
        // Re-apply theme if it got lost
        if (currentDataTheme !== expectedDataTheme) {
            applySavedTheme();
        }
    }
}, 2000); // Check every 2 seconds

// console.log('Simple theme toggle script loaded with theme:', currentTheme);