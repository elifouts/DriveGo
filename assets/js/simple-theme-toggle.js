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

// Theme colors for dynamic favicon
const THEME_COLORS = {
    midnight: { bg: '#0f1419', gradient: ['#06b6d4', '#0891b2', '#0e7490'] },
    nord: { bg: '#2e3440', gradient: ['#88c0d0', '#81a1c1', '#5e81ac'] },
    forest: { bg: '#0f1a14', gradient: ['#10b981', '#059669', '#047857'] },
    cyberpunk: { bg: '#0c0c0f', gradient: ['#8b5cf6', '#7c3aed', '#6d28d9'] },
    gruvbox: { bg: '#1d2021', gradient: ['#fabd2f', '#d79921', '#b57614'] },
    noctua: { bg: '#1a1612', gradient: ['#d4a574', '#b8935a', '#9c7f42'] },
    dracula: { bg: '#282a36', gradient: ['#bd93f9', '#9580ff', '#7c6aef'] },
    everforest: { bg: '#2d353b', gradient: ['#a7c080', '#83b366', '#5f9f4f'] },
    crimson: { bg: '#2c1810', gradient: ['#ef4444', '#dc2626', '#b91c1c'] }
};

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
    
    // Update favicon with theme colors
    updateFavicon(themeName);
    
    // Additional cache busting techniques
    const originalTitle = document.title;
    
    // Method 1: Title manipulation
    document.title = '🎨 ' + originalTitle;
    setTimeout(() => {
        document.title = originalTitle;
    }, 200);
    
    // Method 2: Force browser to recognize favicon change
    setTimeout(() => {
        // Create a temporary invisible iframe to trigger favicon refresh
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'data:text/html,<html><head><link rel="icon" href="data:,"></head></html>';
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 100);
    }, 300);
    
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

function updateFavicon(themeName) {
    const colors = THEME_COLORS[themeName] || THEME_COLORS.nord;
    
    // Create canvas to generate PNG favicon (more reliable than SVG for dynamic updates)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, colors.gradient[0]);
    gradient.addColorStop(0.5, colors.gradient[1]);
    gradient.addColorStop(1, colors.gradient[2]);
    
    // Draw background with rounded corners
    ctx.fillStyle = colors.bg;
    roundRect(ctx, 0, 0, 64, 64, 16);
    ctx.fill();
    
    // Draw DG text with gradient
    ctx.fillStyle = gradient;
    ctx.font = 'bold 28px Orbitron, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add glow effect
    ctx.shadowColor = colors.gradient[0];
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.fillText('DG', 32, 32);
    
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Remove all existing favicon elements
    const head = document.head;
    const existingFavicons = head.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Create multiple favicon elements for better browser support
    const faviconTypes = [
        { rel: 'icon', type: 'image/png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', sizes: '16x16' },
        { rel: 'shortcut icon', type: 'image/png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180' }
    ];
    
    faviconTypes.forEach((config, index) => {
        setTimeout(() => {
            const favicon = document.createElement('link');
            favicon.rel = config.rel;
            favicon.type = config.type;
            if (config.sizes) favicon.sizes = config.sizes;
            favicon.href = dataURL + '?v=' + Date.now() + '_' + index;
            if (index === 0) favicon.id = 'favicon'; // Keep ID on primary favicon
            head.appendChild(favicon);
        }, index * 10);
    });
}

// Helper function to draw rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
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
        
        // Update favicon with theme colors
        updateFavicon(currentTheme);
        
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