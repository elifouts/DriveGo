// DriveGo Authentication State Handler
class AuthStateHandler {
    constructor() {
        this.isSignedIn = false;
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuthState();
        this.bindEvents();
        this.updateUI();
    }

    checkAuthState() {
        // Check localStorage for demo user data
        const userData = localStorage.getItem('drivego-user');
        if (userData) {
            try {
                this.user = JSON.parse(userData);
                this.isSignedIn = true;
            } catch (e) {
                this.signOut();
            }
        }
    }

    bindEvents() {
        // Handle auth button clicks
        const authButtons = document.querySelectorAll('#auth-button, #mobile-auth-button');
        authButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isSignedIn) {
                    this.showUserMenu(btn);
                } else {
                    this.showSignInModal();
                }
            });
        });

        // Listen for auth events
        document.addEventListener('userSignedIn', (e) => {
            this.handleSignIn(e.detail);
        });

        document.addEventListener('userSignedOut', () => {
            this.handleSignOut();
        });
    }

    handleSignIn(userData) {
        this.user = userData;
        this.isSignedIn = true;
        localStorage.setItem('drivego-user', JSON.stringify(userData));
        this.updateUI();
    }

    handleSignOut() {
        this.user = null;
        this.isSignedIn = false;
        localStorage.removeItem('drivego-user');
        this.updateUI();
    }

    updateUI() {
        this.updateAuthButtons();
        this.updateAddRouteButton();
        this.updateUserVisibleElements();
    }

    updateAuthButtons() {
        const authButtons = document.querySelectorAll('#auth-button, #mobile-auth-button');
        authButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span') || btn;
            
            if (this.isSignedIn) {
                if (icon) icon.className = 'fas fa-user-circle';
                if (text.tagName === 'SPAN') {
                    text.textContent = this.user?.displayName || 'Account';
                } else {
                    btn.innerHTML = '<i class="fas fa-user-circle"></i> ' + (this.user?.displayName || this.user?.email || 'Account');
                }
                btn.classList.add('signed-in');
            } else {
                if (icon) icon.className = 'fas fa-user';
                if (text.tagName === 'SPAN') {
                    text.textContent = 'Sign In';
                } else {
                    btn.innerHTML = '<i class="fas fa-user"></i> Sign In';
                }
                btn.classList.remove('signed-in');
            }
        });
    }

    updateAddRouteButton() {
        const addRouteButtons = document.querySelectorAll('.cta-btn, a[href*="add-route"]');
        addRouteButtons.forEach(btn => {
            if (this.isSignedIn) {
                btn.classList.remove('hidden');
                btn.style.display = '';
            } else {
                btn.classList.add('hidden');
                btn.style.display = 'none';
            }
        });
    }

    updateUserVisibleElements() {
        const userElements = document.querySelectorAll('.user-only');
        const guestElements = document.querySelectorAll('.guest-only');
        
        userElements.forEach(el => {
            el.style.display = this.isSignedIn ? '' : 'none';
        });
        
        guestElements.forEach(el => {
            el.style.display = this.isSignedIn ? 'none' : '';
        });
    }

    showSignInModal() {
        // Create and show sign-in modal
        const modal = this.createSignInModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    createSignInModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-backdrop"></div>
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h3>Welcome to DriveGo</h3>
                    <button class="auth-modal-close">&times;</button>
                </div>
                <div class="auth-modal-body">
                    <p>Sign in to access all features including route sharing, favorites, and community features.</p>
                    <div class="auth-demo-options">
                        <button class="auth-demo-btn" data-demo="driver">
                            <i class="fas fa-car"></i>
                            <div>
                                <strong>Demo Driver</strong>
                                <small>John Doe - Car Enthusiast</small>
                            </div>
                        </button>
                        <button class="auth-demo-btn" data-demo="explorer">
                            <i class="fas fa-compass"></i>
                            <div>
                                <strong>Demo Explorer</strong>
                                <small>Jane Smith - Route Explorer</small>
                            </div>
                        </button>
                        <button class="auth-demo-btn" data-demo="photographer">
                            <i class="fas fa-camera"></i>
                            <div>
                                <strong>Demo Photographer</strong>
                                <small>Mike Johnson - Scenic Routes</small>
                            </div>
                        </button>
                    </div>
                    <div class="auth-divider">
                        <span>or continue with</span>
                    </div>
                    <div class="auth-providers">
                        <button class="auth-provider-btn google-btn" disabled>
                            <i class="fab fa-google"></i>
                            Google (Demo Only)
                        </button>
                        <button class="auth-provider-btn github-btn" disabled>
                            <i class="fab fa-github"></i>
                            GitHub (Demo Only)
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Bind modal events
        const closeBtn = modal.querySelector('.auth-modal-close');
        const backdrop = modal.querySelector('.auth-modal-backdrop');
        const demoButtons = modal.querySelectorAll('.auth-demo-btn');

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        demoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const demoType = btn.dataset.demo;
                this.signInWithDemo(demoType);
                closeModal();
            });
        });

        return modal;
    }

    signInWithDemo(demoType) {
        const demoUsers = {
            driver: {
                id: 'demo-driver-1',
                email: 'john.doe@example.com',
                displayName: 'John Doe',
                photoURL: null,
                type: 'demo',
                demoType: 'driver',
                joinDate: new Date().toISOString(),
                stats: {
                    routesShared: 15,
                    milesExplored: 1247,
                    followers: 89
                }
            },
            explorer: {
                id: 'demo-explorer-1',
                email: 'jane.smith@example.com',
                displayName: 'Jane Smith',
                photoURL: null,
                type: 'demo',
                demoType: 'explorer',
                joinDate: new Date().toISOString(),
                stats: {
                    routesShared: 32,
                    milesExplored: 2891,
                    followers: 156
                }
            },
            photographer: {
                id: 'demo-photographer-1',
                email: 'mike.johnson@example.com',
                displayName: 'Mike Johnson',
                photoURL: null,
                type: 'demo',
                demoType: 'photographer',
                joinDate: new Date().toISOString(),
                stats: {
                    routesShared: 42,
                    milesExplored: 3567,
                    followers: 234
                }
            }
        };

        const userData = demoUsers[demoType];
        if (userData) {
            document.dispatchEvent(new CustomEvent('userSignedIn', {
                detail: userData
            }));
        }
    }

    showUserMenu(button) {
        // Create user menu dropdown
        const existingMenu = document.querySelector('.user-menu-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.innerHTML = `
            <div class="user-menu-header">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-info">
                    <strong>${this.user.displayName}</strong>
                    <small>${this.user.email}</small>
                </div>
            </div>
            <div class="user-menu-items">
                <a href="pages/profile.html" class="user-menu-item">
                    <i class="fas fa-user"></i>
                    Profile
                </a>
                <a href="pages/my-routes.html" class="user-menu-item">
                    <i class="fas fa-route"></i>
                    My Routes
                </a>
                <a href="pages/favorites.html" class="user-menu-item">
                    <i class="fas fa-heart"></i>
                    Favorites
                </a>
                <a href="pages/settings.html" class="user-menu-item">
                    <i class="fas fa-cog"></i>
                    Settings
                </a>
                <div class="user-menu-divider"></div>
                <button class="user-menu-item sign-out-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Sign Out
                </button>
            </div>
        `;

        // Position menu
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 10) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        menu.style.zIndex = '1000';

        document.body.appendChild(menu);

        // Handle sign out
        const signOutBtn = menu.querySelector('.sign-out-btn');
        signOutBtn.addEventListener('click', () => {
            this.signOut();
            menu.remove();
        });

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    signOut() {
        document.dispatchEvent(new CustomEvent('userSignedOut'));
    }

    // Public API
    getCurrentUser() {
        return this.user;
    }

    isUserSignedIn() {
        return this.isSignedIn;
    }
}

// Initialize auth handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authHandler = new AuthStateHandler();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthStateHandler;
}