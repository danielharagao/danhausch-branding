// ===========================
// Theme Management System
// ===========================

// Get theme from localStorage or default to 'dark'
let currentTheme = localStorage.getItem('theme') || 'dark';

// Apply theme
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.removeAttribute('data-theme');
    }
    
    // Update icons
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    
    if (darkIcon && lightIcon) {
        if (theme === 'light') {
            darkIcon.classList.remove('active');
            lightIcon.classList.add('active');
        } else {
            darkIcon.classList.add('active');
            lightIcon.classList.remove('active');
        }
    }
    
    // Store preference
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

// Toggle theme
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// Initialize theme on page load
function initTheme() {
    // Apply saved theme immediately (before DOMContentLoaded to prevent flash)
    applyTheme(currentTheme);
    
    // Set up toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Also check system preference if no saved preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme-manual')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    });
}

// Mark as manual selection when user clicks
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            localStorage.setItem('theme-manual', 'true');
        });
    }
});

// Initialize immediately
initTheme();

// Export for use in other scripts
window.themeManager = {
    getCurrentTheme: () => currentTheme,
    setTheme: applyTheme,
    toggleTheme: toggleTheme
};


