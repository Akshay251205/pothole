/* ==========================================================================
   RoadGuard - Core Application Script (js/app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Initialization & Layout Setup
    initTheme();
    setupMobileNav();
    setupActiveNavLink();
    createToastContainer();
    initLoaderAnimation();
});

// Toast System
function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'danger') iconClass = 'fa-times-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `
        <i class="fas ${iconClass} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s reverse';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 4000);
}

// Global Loader Animation
function initLoaderAnimation() {
    // Insert a loading spinner that fades out on page load
    const loader = document.createElement('div');
    loader.className = 'spinner-backdrop';
    loader.innerHTML = `
        <div class="spinner"></div>
        <h3 style="font-weight:600; color:var(--text-main)">RoadGuard CIVIC Portal</h3>
        <p style="font-size:12px; color:var(--text-muted)">Loading secured workspace...</p>
    `;
    document.body.appendChild(loader);

    setTimeout(() => {
        loader.style.transition = 'opacity 0.4s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 400);
    }, 500); // 500ms delay to make it smooth
}

// Dark / Light Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('roadguard_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        updateThemeIcon(savedTheme, toggleBtn);
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('roadguard_theme', newTheme);
            updateThemeIcon(newTheme, toggleBtn);
            showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Enabled`, 'success');
            
            // Dispatch event for components to redraw charts on theme change
            window.dispatchEvent(new Event('themeChanged'));
        });
    }
}

function updateThemeIcon(theme, button) {
    if (theme === 'dark') {
        button.innerHTML = '<i class="fas fa-sun"></i>';
        button.title = 'Switch to Light Mode';
    } else {
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.title = 'Switch to Dark Mode';
    }
}

// Mobile Responsive Navigation Menu
function setupMobileNav() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Active Nav Link Highlighter based on current HTML filename
function setupActiveNavLink() {
    const path = window.location.pathname;
    const pageName = path.split("/").pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Custom Confirmation Dialog helper
function showCustomConfirm(message, onConfirm) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.display = 'flex';

    backdrop.innerHTML = `
        <div class="modal-card" style="max-width:400px;">
            <div class="modal-header">
                <h3>Please Confirm</h3>
                <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size:14px; color:var(--text-main)">${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
                <button class="btn btn-danger id="confirm-btn">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.querySelector('#confirm-btn').addEventListener('click', () => {
        backdrop.remove();
        if (onConfirm) onConfirm();
    });
}

// Export functions to global scope
window.showToast = showToast;
window.showCustomConfirm = showCustomConfirm;
