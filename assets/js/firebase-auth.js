// Firebase Authentication System for DriveGo
class FirebaseAuth {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.initialized = false;
        
        // Mock Firebase for demo purposes
        // In production, replace with actual Firebase SDK
        this.mockUsers = JSON.parse(localStorage.getItem('drivego-users') || '{}');
        this.currentUser = JSON.parse(localStorage.getItem('drivego-current-user') || 'null');
        
        this.init();
    }

    async init() {
        try {
            // In production, initialize Firebase here:
            // import { initializeApp } from 'firebase/app';
            // import { getAuth } from 'firebase/auth';
            // import firebaseConfig from '../config/firebase-config.js';
            // this.app = initializeApp(firebaseConfig);
            // this.auth = getAuth(this.app);
            
            console.log('Firebase Auth initialized (Demo Mode)');
            this.initialized = true;
            
            // Simulate auth state restoration
            if (this.currentUser) {
                this.notifyAuthListeners(this.currentUser);
            }
            
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }

    // Authentication Methods
    async signUp(email, password, displayName) {
        try {
            // Mock signup - replace with Firebase auth
            if (this.mockUsers[email]) {
                throw new Error('User already exists');
            }

            const user = {
                uid: this.generateUID(),
                email: email,
                displayName: displayName,
                createdAt: new Date().toISOString(),
                photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=458588&color=fff`,
                emailVerified: false,
                routes: [],
                favorites: [],
                preferences: {
                    theme: 'gruvbox',
                    units: 'metric',
                    notifications: true
                }
            };

            this.mockUsers[email] = { ...user, password: this.hashPassword(password) };
            localStorage.setItem('drivego-users', JSON.stringify(this.mockUsers));
            
            this.currentUser = user;
            localStorage.setItem('drivego-current-user', JSON.stringify(user));
            
            this.notifyAuthListeners(user);
            this.showAuthToast(`Welcome to DriveGo, ${displayName}!`, 'success');
            
            return { user };
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    async signIn(email, password) {
        try {
            const userData = this.mockUsers[email];
            if (!userData || userData.password !== this.hashPassword(password)) {
                throw new Error('Invalid email or password');
            }

            const user = { ...userData };
            delete user.password;

            this.currentUser = user;
            localStorage.setItem('drivego-current-user', JSON.stringify(user));
            
            this.notifyAuthListeners(user);
            this.showAuthToast(`Welcome back, ${user.displayName}!`, 'success');
            
            return { user };
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    async signOut() {
        try {
            this.currentUser = null;
            localStorage.removeItem('drivego-current-user');
            
            this.notifyAuthListeners(null);
            this.showAuthToast('Signed out successfully', 'success');
            
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    async resetPassword(email) {
        try {
            if (!this.mockUsers[email]) {
                throw new Error('No user found with this email');
            }
            
            // Mock password reset
            this.showAuthToast('Password reset email sent!', 'success');
            
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    async updateProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('No user signed in');
            }

            // Merge updates with current user
            this.currentUser = { ...this.currentUser, ...updates };
            
            // Update in mock storage
            const userData = this.mockUsers[this.currentUser.email];
            if (userData) {
                // Don't overwrite password
                const { password } = userData;
                Object.assign(userData, updates);
                userData.password = password; // Preserve password
                this.mockUsers[this.currentUser.email] = userData;
                localStorage.setItem('drivego-users', JSON.stringify(this.mockUsers));
            }
            
            // Update current user session
            localStorage.setItem('drivego-current-user', JSON.stringify(this.currentUser));
            this.notifyAuthListeners(this.currentUser);
            
            this.showAuthToast('Profile updated successfully', 'success');
            
            return this.currentUser;
            
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    // User Profile Methods
    async uploadProfilePhoto(file) {
        try {
            // Mock file upload - in production use Firebase Storage
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    const photoURL = e.target.result;
                    this.updateProfile({ photoURL });
                    resolve(photoURL);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        } catch (error) {
            this.showAuthToast('Photo upload failed', 'error');
            throw error;
        }
    }

    // Route Management
    async saveRoute(routeData) {
        try {
            if (!this.currentUser) {
                throw new Error('Please sign in to save routes');
            }

            const route = {
                id: this.generateUID(),
                ...routeData,
                authorId: this.currentUser.uid,
                authorName: this.currentUser.displayName,
                createdAt: new Date().toISOString(),
                likes: 0,
                comments: []
            };

            this.currentUser.routes.push(route);
            await this.updateProfile({ routes: this.currentUser.routes });
            
            this.showAuthToast('Route saved successfully!', 'success');
            return route;
            
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    async toggleFavorite(routeId) {
        try {
            if (!this.currentUser) {
                throw new Error('Please sign in to favorite routes');
            }

            const favorites = this.currentUser.favorites || [];
            const index = favorites.indexOf(routeId);
            
            if (index > -1) {
                favorites.splice(index, 1);
                this.showAuthToast('Removed from favorites', 'info');
            } else {
                favorites.push(routeId);
                this.showAuthToast('Added to favorites', 'success');
            }
            
            await this.updateProfile({ favorites });
            return favorites.includes(routeId);
            
        } catch (error) {
            this.showAuthToast(error.message, 'error');
            throw error;
        }
    }

    // Auth State Management
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Immediately call with current state
        if (this.currentUser) {
            callback(this.currentUser);
        }
        
        // Return unsubscribe function
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    notifyAuthListeners(user) {
        this.authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }

    // Utility Methods
    generateUID() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    showAuthToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.getElementById('auth-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'auth-toast';
        toast.className = `auth-toast auth-toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e94560' : type === 'success' ? '#4caf50' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1002;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // Getters
    getCurrentUser() {
        return this.currentUser;
    }

    isSignedIn() {
        return !!this.currentUser;
    }
}

// Toast animations
const authToastStyles = document.createElement('style');
authToastStyles.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(authToastStyles);

// Initialize Firebase Auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseAuth = new FirebaseAuth();
    
    // Listen for auth state changes
    window.firebaseAuth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? `Signed in as ${user.displayName}` : 'Signed out');
        
        // Update UI based on auth state
        document.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { user }
        }));
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseAuth;
}