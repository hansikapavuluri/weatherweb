/**
 * WeatherWeb Application
 * Modern weather website UI with theme switching and animations
 */

class WeatherWeb {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.weatherForm = document.getElementById('weatherForm');
        this.weatherContainer = document.getElementById('weatherContainer');
        this.init();
    }

    init() {
        this.initTheme();
        this.initEventListeners();
        this.initAnimations();
    }

    /**
     * Initialize theme based on localStorage or system preference
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Form submission
        if (this.weatherForm) {
            this.weatherForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Initialize animations for weather elements
     */
    initAnimations() {
        // Add fade-in effect to weather container
        if (this.weatherContainer) {
            this.weatherContainer.classList.add('fade-in');
        }

        // Animate detail cards on scroll
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

        document.querySelectorAll('.detail-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add rotation animation to toggle button
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg)';
        }, 300);

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }

    /**
     * Handle form submission with loading animation
     */
    handleFormSubmit(e) {
        // Add loading animation
        if (this.weatherContainer) {
            this.weatherContainer.classList.add('loading');
            
            // Remove loading after a delay (for demo purposes)
            setTimeout(() => {
                this.weatherContainer.classList.remove('loading');
            }, 1500);
        }
    }

    /**
     * Update weather data dynamically (can be called from Django view)
     */
    updateWeatherData(data) {
        const elements = {
            city: document.querySelector('[data-weather="city"]'),
            temperature: document.querySelector('[data-weather="temperature"]'),
            description: document.querySelector('[data-weather="description"]'),
            humidity: document.querySelector('[data-weather="humidity"]'),
            windSpeed: document.querySelector('[data-weather="wind-speed"]')
        };

        // Update text content if elements exist
        Object.keys(data).forEach(key => {
            if (elements[key] && data[key]) {
                elements[key].textContent = data[key];
            }
        });

        // Trigger animation
        this.weatherContainer.classList.add('weather-updated');
        setTimeout(() => {
            this.weatherContainer.classList.remove('weather-updated');
        }, 500);
    }
}

/**
 * Weather icon animations and effects
 */
class WeatherIconManager {
    constructor() {
        this.initIconEffects();
    }

    initIconEffects() {
        // Add interactive hover effects to weather icons
        document.querySelectorAll('.weather-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        });
    }
}

/**
 * Search suggestions and autocomplete (can be extended)
 */
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.city-input');
        this.initSearchFeatures();
    }

    initSearchFeatures() {
        if (!this.searchInput) return;

        // Add focus effect
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
        });

        this.searchInput.addEventListener('blur', () => {
            this.searchInput.parentElement.style.boxShadow = 'var(--glass-shadow)';
        });

        // Add enter key handling
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.search-btn').click();
            }
        });
    }
}

/**
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherWeb();
    window.iconManager = new WeatherIconManager();
    window.searchManager = new SearchManager();

    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again
        document.querySelectorAll('.weather-icon').forEach(icon => {
            icon.style.animation = 'none';
            icon.offsetHeight; // Trigger reflow
            icon.style.animation = null;
        });
    }
});

/**
 * Error handling for weather data fetch
 */
window.addEventListener('error', (e) => {
    console.error('WeatherWeb Error:', e.message);
    // Display user-friendly error message
    const weatherContainer = document.getElementById('weatherContainer');
    if (weatherContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <p>Something went wrong. Please try again later.</p>
        `;
        weatherContainer.prepend(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherWeb, WeatherIconManager, SearchManager };
}