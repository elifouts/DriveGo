// UI Components for Firebase Authentication
class AuthUI {
    constructor() {
        this.modals = {};
        this.currentUser = null;
        this.init();
    }

    init() {
        this.createAuthButton();
        this.createAuthModals();
        this.bindEvents();
        
        // Listen for auth state changes
        document.addEventListener('authStateChanged', (e) => {
            this.handleAuthStateChange(e.detail.user);
        });
    }

    createAuthButton() {
        const authButton = document.createElement('div');
        authButton.id = 'auth-button-container';
        authButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            z-index: 1000;
        `;
        
        authButton.innerHTML = `
            <button id="auth-toggle" class="btn btn-primary auth-btn">
                <i class="fas fa-user"></i>
                <span id="auth-text">Sign In</span>
            </button>
        `;
        
        document.body.appendChild(authButton);
    }

    createAuthModals() {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'auth-modals';
        modalsContainer.innerHTML = `
            <!-- Sign In Modal -->
            <div class="modal fade" id="signInModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="background: var(--bg_one); border: 2px solid var(--accent_color);">
                        <div class="modal-header" style="border-bottom: 1px solid var(--secondary_color);">
                            <h5 class="modal-title" style="color: var(--primary_color);">
                                <i class="fas fa-sign-in-alt"></i> Sign In to DriveGo
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" style="filter: invert(1);"></button>
                        </div>
                        <div class="modal-body">
                            <form id="signInForm">
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Email</label>
                                    <input type="email" class="form-control" id="signInEmail" required 
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Password</label>
                                    <input type="password" class="form-control" id="signInPassword" required
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <a href="#" id="forgotPassword" style="color: var(--accent_color);">Forgot Password?</a>
                                    <a href="#" id="switchToSignUp" style="color: var(--accent_color);">Create Account</a>
                                </div>
                                <button type="submit" class="btn btn-primary w-100 enhanced-btn">
                                    <i class="fas fa-sign-in-alt"></i> Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sign Up Modal -->
            <div class="modal fade" id="signUpModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="background: var(--bg_one); border: 2px solid var(--accent_color);">
                        <div class="modal-header" style="border-bottom: 1px solid var(--secondary_color);">
                            <h5 class="modal-title" style="color: var(--primary_color);">
                                <i class="fas fa-user-plus"></i> Join DriveGo
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" style="filter: invert(1);"></button>
                        </div>
                        <div class="modal-body">
                            <form id="signUpForm">
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Display Name</label>
                                    <input type="text" class="form-control" id="signUpName" required
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Email</label>
                                    <input type="email" class="form-control" id="signUpEmail" required
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Password</label>
                                    <input type="password" class="form-control" id="signUpPassword" required minlength="6"
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" style="color: var(--text_color);">Confirm Password</label>
                                    <input type="password" class="form-control" id="signUpConfirmPassword" required
                                           style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <a href="#" id="switchToSignIn" style="color: var(--accent_color);">Already have an account?</a>
                                </div>
                                <button type="submit" class="btn btn-primary w-100 enhanced-btn">
                                    <i class="fas fa-user-plus"></i> Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Modal -->
            <div class="modal fade" id="profileModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content" style="background: var(--bg_one); border: 2px solid var(--accent_color);">
                        <div class="modal-header" style="border-bottom: 1px solid var(--secondary_color);">
                            <h5 class="modal-title" style="color: var(--primary_color);">
                                <i class="fas fa-user-cog"></i> Profile Settings
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" style="filter: invert(1);"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <div class="profile-photo-container mb-3">
                                        <img id="profilePhoto" src="" alt="Profile" class="rounded-circle" 
                                             style="width: 120px; height: 120px; object-fit: cover; border: 3px solid var(--accent_color);">
                                        <div class="mt-2">
                                            <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                                            <button class="btn btn-sm btn-outline-primary" onclick="document.getElementById('photoUpload').click()">
                                                <i class="fas fa-camera"></i> Change Photo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <form id="profileForm">
                                        <div class="mb-3">
                                            <label class="form-label" style="color: var(--text_color);">Display Name</label>
                                            <input type="text" class="form-control" id="profileName"
                                                   style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label" style="color: var(--text_color);">Email</label>
                                            <input type="email" class="form-control" id="profileEmail" readonly
                                                   style="background: var(--secondary_color); border: 1px solid var(--accent_color); color: var(--text_color);">
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="form-label" style="color: var(--text_color);">Routes Shared</label>
                                                <div id="routeCount" style="color: var(--accent_color); font-size: 1.5rem; font-weight: bold;">0</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label" style="color: var(--text_color);">Favorites</label>
                                                <div id="favoriteCount" style="color: var(--accent_color); font-size: 1.5rem; font-weight: bold;">0</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <hr style="border-color: var(--secondary_color);">
                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btn-success enhanced-btn" id="saveProfile">
                                    <i class="fas fa-save"></i> Save Changes
                                </button>
                                <button type="button" class="btn btn-danger" id="signOutBtn">
                                    <i class="fas fa-sign-out-alt"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalsContainer);
    }

    bindEvents() {
        // Auth button click
        document.getElementById('auth-toggle').addEventListener('click', () => {
            if (this.currentUser) {
                this.showProfileModal();
            } else {
                this.showSignInModal();
            }
        });

        // Form submissions
        document.getElementById('signInForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignIn();
        });

        document.getElementById('signUpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignUp();
        });

        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate();
        });

        // Modal switches
        document.getElementById('switchToSignUp').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signInModal', 'signUpModal');
        });

        document.getElementById('switchToSignIn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signUpModal', 'signInModal');
        });

        // Profile actions
        document.getElementById('saveProfile').addEventListener('click', () => {
            this.handleProfileUpdate();
        });

        document.getElementById('signOutBtn').addEventListener('click', () => {
            this.handleSignOut();
        });

        // Photo upload
        document.getElementById('photoUpload').addEventListener('change', (e) => {
            this.handlePhotoUpload(e.target.files[0]);
        });

        // Forgot password
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    async handleSignIn() {
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        try {
            await window.firebaseAuth.signIn(email, password);
            bootstrap.Modal.getInstance(document.getElementById('signInModal')).hide();
        } catch (error) {
            console.error('Sign in error:', error);
        }
    }

    async handleSignUp() {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        if (password !== confirmPassword) {
            window.firebaseAuth.showAuthToast('Passwords do not match', 'error');
            return;
        }

        try {
            await window.firebaseAuth.signUp(email, password, name);
            bootstrap.Modal.getInstance(document.getElementById('signUpModal')).hide();
        } catch (error) {
            console.error('Sign up error:', error);
        }
    }

    async handleProfileUpdate() {
        const name = document.getElementById('profileName').value;

        try {
            await window.firebaseAuth.updateProfile({ displayName: name });
        } catch (error) {
            console.error('Profile update error:', error);
        }
    }

    async handleSignOut() {
        try {
            await window.firebaseAuth.signOut();
            bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    async handlePhotoUpload(file) {
        if (!file) return;

        try {
            const photoURL = await window.firebaseAuth.uploadProfilePhoto(file);
            document.getElementById('profilePhoto').src = photoURL;
        } catch (error) {
            console.error('Photo upload error:', error);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('signInEmail').value;
        if (!email) {
            window.firebaseAuth.showAuthToast('Please enter your email first', 'error');
            return;
        }

        try {
            await window.firebaseAuth.resetPassword(email);
        } catch (error) {
            console.error('Password reset error:', error);
        }
    }

    handleAuthStateChange(user) {
        this.currentUser = user;
        
        if (user) {
            // Update auth button for signed-in user
            document.getElementById('auth-text').textContent = user.displayName;
            document.getElementById('auth-toggle').innerHTML = `
                <img src="${user.photoURL}" alt="Profile" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
                <span>${user.displayName}</span>
            `;
            
            // Update profile modal with user data
            this.updateProfileModal(user);
        } else {
            // Update auth button for signed-out user
            document.getElementById('auth-text').textContent = 'Sign In';
            document.getElementById('auth-toggle').innerHTML = `
                <i class="fas fa-user"></i>
                <span id="auth-text">Sign In</span>
            `;
        }
    }

    updateProfileModal(user) {
        document.getElementById('profilePhoto').src = user.photoURL;
        document.getElementById('profileName').value = user.displayName;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('routeCount').textContent = (user.routes || []).length;
        document.getElementById('favoriteCount').textContent = (user.favorites || []).length;
    }

    showSignInModal() {
        new bootstrap.Modal(document.getElementById('signInModal')).show();
    }

    showSignUpModal() {
        new bootstrap.Modal(document.getElementById('signUpModal')).show();
    }

    showProfileModal() {
        new bootstrap.Modal(document.getElementById('profileModal')).show();
    }

    switchModal(fromModalId, toModalId) {
        bootstrap.Modal.getInstance(document.getElementById(fromModalId)).hide();
        setTimeout(() => {
            new bootstrap.Modal(document.getElementById(toModalId)).show();
        }, 300);
    }
}

// Initialize Auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Bootstrap to be available
    if (typeof bootstrap !== 'undefined') {
        window.authUI = new AuthUI();
    } else {
        // Fallback: wait a bit for Bootstrap to load
        setTimeout(() => {
            window.authUI = new AuthUI();
        }, 100);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthUI;
}