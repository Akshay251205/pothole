/* ==========================================================================
   RoadGuard - Authentication Manager (js/auth.js)
   ========================================================================== */

const USERS_STORAGE_KEY = 'roadguard_users';
const SESSION_STORAGE_KEY = 'roadguard_session';

const DEFAULT_CITIZEN = {
    name: 'Demo Citizen',
    email: 'citizen@gmail.com',
    phone: '9876543210',
    password: '123456'
};

// Initialize default user
function initUsers() {
    let users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_CITIZEN]));
    }
}
initUsers();

const Auth = {
    // Register Citizen
    registerCitizen: function(name, email, phone, password) {
        let users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
        
        // Check if user already exists
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            return { success: false, message: 'Email address is already registered.' };
        }

        const newUser = { name, email, phone, password };
        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Log in the user automatically after registration
        this.setSession(newUser, 'citizen');
        return { success: true, message: 'Registration successful!' };
    },

    // Citizen Login
    loginCitizen: function(email, password) {
        let users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            this.setSession(user, 'citizen');
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password.' };
    },

    // Authority Login
    loginAuthority: function(username, password) {
        if (username === 'admin' && password === 'admin123') {
            const adminUser = {
                name: 'Municipal Administrator',
                username: 'admin',
                role: 'authority'
            };
            this.setSession(adminUser, 'authority');
            return { success: true };
        }
        return { success: false, message: 'Invalid administrative credentials.' };
    },

    // Session Management Helpers
    setSession: function(user, role) {
        const sessionData = {
            ...user,
            role: role,
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    },

    getSession: function() {
        const session = localStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    },

    logout: function() {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        window.location.href = 'index.html';
    },

    // Route Guards (checks page access eligibility)
    requireAuth: function(requiredRole = 'citizen') {
        const session = this.getSession();
        if (!session) {
            window.showToast('Please log in to access this page.', 'warning');
            setTimeout(() => {
                window.location.href = requiredRole === 'authority' ? 'authority-login.html' : 'citizen-login.html';
            }, 1000);
            return false;
        }
        
        if (session.role !== requiredRole) {
            window.showToast('Access denied. Redirecting to home...', 'danger');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            return false;
        }
        return true;
    }
};

window.Auth = Auth;
