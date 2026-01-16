// ===========================
// Links Page Interactions
// ===========================

// Theme toggle for links page
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleFab = document.getElementById('themeToggleFab');
    const darkIconFab = document.getElementById('darkIconFab');
    const lightIconFab = document.getElementById('lightIconFab');
    
    // Sync with theme.js
    if (themeToggleFab && darkIconFab && lightIconFab) {
        // Update icons based on current theme
        const updateIcons = () => {
            const currentTheme = window.themeManager ? window.themeManager.getCurrentTheme() : 'dark';
            if (currentTheme === 'light') {
                darkIconFab.classList.remove('active');
                lightIconFab.classList.add('active');
            } else {
                darkIconFab.classList.add('active');
                lightIconFab.classList.remove('active');
            }
        };
        
        // Initial update
        updateIcons();
        
        // Handle click
        themeToggleFab.addEventListener('click', () => {
            if (window.themeManager) {
                window.themeManager.toggleTheme();
                updateIcons();
            }
        });
    }
});

// Smooth scroll for back button
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            // Let the default behavior handle the navigation
            // Just add a nice visual feedback
            backButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                backButton.style.transform = '';
            }, 150);
        });
    }
});

// Add card click analytics (placeholder)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.social-card, .link-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const title = card.querySelector('.card-title')?.textContent || 'Unknown';
            console.log(`Card clicked: ${title}`);
            // Add your analytics tracking here
        });
    });
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards
    const cards = document.querySelectorAll('.social-card, .link-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Console message
console.log('%c👋 Welcome to Dan Hausch\'s Links!', 'font-size: 20px; font-weight: bold; color: #667EEA;');
console.log('%cConnect with me on any platform!', 'font-size: 14px; color: #a0aec0;');

