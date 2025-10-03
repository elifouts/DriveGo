// Interactive Grid Background for DriveGo
class GridBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.gridSize = 50;
        this.particleCount = 0;
        this.currentTheme = 'midnight';
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createGrid();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        // Create container
        const container = document.createElement('div');
        container.className = 'grid-background';
        container.id = 'grid-background';
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        container.appendChild(this.canvas);
        document.body.appendChild(container);
        
        this.resize();
    }

    createGrid() {
        this.particles = [];
        const cols = Math.ceil(window.innerWidth / this.gridSize) + 1;
        const rows = Math.ceil(window.innerHeight / this.gridSize) + 1;
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                this.particles.push({
                    x: x * this.gridSize,
                    y: y * this.gridSize,
                    originalX: x * this.gridSize,
                    originalY: y * this.gridSize,
                    opacity: Math.random() * 0.5 + 0.1,
                    size: Math.random() * 2 + 1,
                    offsetX: 0,
                    offsetY: 0,
                    wave: Math.random() * Math.PI * 2
                });
            }
        }
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.createGrid();
    }

    bindEvents() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });

        // Theme change listener
        document.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particle, index) => {
            // Calculate distance from mouse
            const dx = this.mouse.x - particle.originalX;
            const dy = this.mouse.y - particle.originalY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 100;
            
            // Mouse interaction effect
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                particle.offsetX = dx * force * 0.1;
                particle.offsetY = dy * force * 0.1;
            } else {
                particle.offsetX *= 0.95;
                particle.offsetY *= 0.95;
            }
            
            // Wave effect
            particle.wave += 0.02;
            const waveX = Math.sin(particle.wave + particle.originalX * 0.01) * 2;
            const waveY = Math.cos(particle.wave + particle.originalY * 0.01) * 2;
            
            // Final position
            const finalX = particle.originalX + particle.offsetX + waveX;
            const finalY = particle.originalY + particle.offsetY + waveY;
            
            // Draw particle
            this.drawParticle(finalX, finalY, particle.size, particle.opacity);
            
            // Draw connections
            this.drawConnections(particle, index, finalX, finalY);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawParticle(x, y, size, opacity) {
        const color = this.getThemeColor();
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        this.ctx.fill();
    }

    drawConnections(particle, index, x, y) {
        const maxConnectionDistance = this.gridSize * 1.5;
        const color = this.getThemeColor();
        
        // Only draw connections to nearby particles (optimization)
        for (let i = index + 1; i < Math.min(index + 20, this.particles.length); i++) {
            const other = this.particles[i];
            const dx = x - (other.originalX + other.offsetX);
            const dy = y - (other.originalY + other.offsetY);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxConnectionDistance) {
                const opacity = (1 - distance / maxConnectionDistance) * 0.2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(other.originalX + other.offsetX, other.originalY + other.offsetY);
                this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        }
    }

    getThemeColor() {
        const themeColors = {
            midnight: { r: 6, g: 182, b: 212 },
            nord: { r: 103, g: 232, b: 249 },
            gruvbox: { r: 250, g: 189, b: 47 },
            noctua: { r: 212, g: 165, b: 116 },
            cyberpunk: { r: 139, g: 92, b: 246 },
            dracula: { r: 189, g: 147, b: 249 },
            forest: { r: 52, g: 211, b: 153 },
            everforest: { r: 167, g: 192, b: 128 },
            crimson: { r: 220, g: 38, b: 38 }
        };
        
        return themeColors[this.currentTheme] || themeColors.midnight;
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        // Force immediate redraw with new theme colors
        this.draw();
    }

    destroy() {
        this.pause();
        
        const container = document.getElementById('grid-background');
        if (container) {
            container.remove();
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Theme Management System
class ThemeManager {
    constructor() {
        this.themes = {
            midnight: {
                name: 'Midnight',
                description: 'Smooth dark elegance',
                colors: ['#06b6d4', '#0ea5e9', '#38bdf8'],
                type: 'dark'
            },
            nord: {
                name: 'Nordic',
                description: 'Arctic smooth vibes',
                colors: ['#67e8f9', '#22d3ee', '#0ea5e9'],
                type: 'dark'
            },
            gruvbox: {
                name: 'Gruvbox',
                description: 'Warm retro vibes',
                colors: ['#fabd2f', '#fe8019', '#d79921'],
                type: 'dark'
            },
            noctua: {
                name: 'Noctua',
                description: 'Premium brown elegance',
                colors: ['#d4a574', '#b8956a', '#9c7f56'],
                type: 'dark'
            },
            cyberpunk: {
                name: 'Neon',
                description: 'Refined cyber aesthetic',
                colors: ['#8b5cf6', '#a855f7', '#c084fc'],
                type: 'dark'
            },
            dracula: {
                name: 'Dracula',
                description: 'Gothic purple darkness',
                colors: ['#bd93f9', '#ff79c6', '#8be9fd'],
                type: 'dark'
            },
            forest: {
                name: 'Forest',
                description: 'Natural emerald tones',
                colors: ['#34d399', '#10b981', '#22c55e'],
                type: 'dark'
            },
            everforest: {
                name: 'Everforest',
                description: 'Serene forest greens',
                colors: ['#a7c080', '#83c092', '#7fbbb3'],
                type: 'dark'
            },
            crimson: {
                name: 'Crimson',
                description: 'Bold red darkness',
                colors: ['#dc2626', '#b91c1c', '#991b1b'],
                type: 'dark'
            }
        };
        
        this.currentTheme = this.getStoredTheme() || 'midnight';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.initializeSettingsPage();
    }

    getStoredTheme() {
        return localStorage.getItem('drivego-theme');
    }

    storeTheme(theme) {
        localStorage.setItem('drivego-theme', theme);
    }

    applyTheme(themeKey) {
        if (!this.themes[themeKey]) return;
        
        document.documentElement.setAttribute('data-theme', themeKey);
        this.currentTheme = themeKey;
        this.storeTheme(themeKey);
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { 
                theme: themeKey, 
                themeData: this.themes[themeKey] 
            }
        }));
        
        // Update grid background if it exists
        if (window.gridBackground) {
            window.gridBackground.updateTheme(themeKey);
        }
        
        // Store theme preference with timestamp for consistency across pages
        localStorage.setItem('theme-timestamp', Date.now().toString());
    }

    initializeSettingsPage() {
        const themeGrid = document.getElementById('theme-grid');
        if (!themeGrid) return;
        
        // Populate theme options
        Object.entries(this.themes).forEach(([key, theme]) => {
            const themeCard = this.createThemeCard(key, theme);
            themeGrid.appendChild(themeCard);
        });
    }

    createThemeCard(key, theme) {
        const card = document.createElement('div');
        card.className = `theme-card ${key === this.currentTheme ? 'active' : ''}`;
        card.dataset.theme = key;
        
        card.innerHTML = `
            <div class="theme-preview">
                ${theme.colors.map(color => `<div class="color-dot" style="background: ${color}"></div>`).join('')}
            </div>
            <div class="theme-name">${theme.name}</div>
            <div class="theme-description">${theme.description}</div>
        `;
        
        card.addEventListener('click', () => {
            this.selectTheme(key);
        });
        
        return card;
    }

    selectTheme(themeKey) {
        // Update active state
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.theme === themeKey) {
                card.classList.add('active');
            }
        });
        
        // Apply theme
        this.applyTheme(themeKey);
        
        // Show feedback
        this.showThemeChangeToast(this.themes[themeKey].name);
    }

    showThemeChangeToast(themeName) {
        // Remove existing toast
        const existingToast = document.getElementById('theme-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'theme-toast';
        toast.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: var(--text-color);
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            border: 1px solid rgba(var(--accent-rgb), 0.3);
            font-weight: 500;
            font-size: 14px;
            z-index: 1001;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            box-shadow: 0 8px 32px var(--shadow-color);
            max-width: 250px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-palette" style="color: var(--accent-color); font-size: 16px;"></i>
                <span>${themeName} theme activated</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }

    getCurrentTheme() {
        return {
            key: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    }

    // Cycle to next theme (for theme toggle button)
    cycleTheme() {
        const themeKeys = Object.keys(this.themes);
        const currentIndex = themeKeys.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const nextTheme = themeKeys[nextIndex];
        
        this.applyTheme(nextTheme);
        return this.themes[nextTheme];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Themes.js loading on page:', window.location.pathname);
    
    try {
        // Initialize theme manager first
        window.themeManager = new ThemeManager();
        console.log('Theme manager initialized successfully');
        
        // Initialize grid background
        window.gridBackground = new GridBackground();
        console.log('Grid background initialized successfully');
        
        // Force immediate theme update on page load for consistency
        const currentTheme = window.themeManager.currentTheme;
        console.log('Current theme:', currentTheme);
        
        if (window.gridBackground) {
            window.gridBackground.updateTheme(currentTheme);
        }
        
        // Wait a bit for DOM to be fully ready, then initialize buttons
        setTimeout(() => {
            initializeThemeButtons();
        }, 100);
        
    } catch (error) {
        console.error('Theme initialization error:', error);
    }
});

function initializeThemeButtons() {
    // Initialize theme toggle buttons (desktop and mobile)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
    
    console.log('Theme buttons found:', { desktop: !!themeToggleBtn, mobile: !!mobileThemeToggleBtn });
    
    const handleThemeToggle = (button) => {
        try {
            const newTheme = window.themeManager.cycleTheme();
            
            // Add a visual feedback effect
            if (button) {
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            }
            
            console.log(`Theme changed to: ${newTheme.name}`);
        } catch (error) {
            console.error('Theme toggle error:', error);
            // Fallback: reinitialize theme manager
            window.themeManager = new ThemeManager();
        }
    };
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => handleThemeToggle(themeToggleBtn));
        console.log('Desktop theme button initialized');
    } else {
        console.warn('Desktop theme toggle button not found');
    }
    
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', () => handleThemeToggle(mobileThemeToggleBtn));
        console.log('Mobile theme button initialized');
    } else {
        console.warn('Mobile theme toggle button not found');
    }
    
    console.log('Theme system and grid background initialized');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.gridBackground) {
        window.gridBackground.destroy();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GridBackground, ThemeManager };
}