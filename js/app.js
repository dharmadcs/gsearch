/**
 * GSearch - GatotKaca Cyber Modern Main Application
 * Main application controller and initialization
 */

class GSearchApp {
    constructor() {
        this.version = '1.0.0';
        this.name = 'GSearch - GatotKaca Cyber Modern';
        this.initialized = false;
        
        this.initializeApp();
    }

    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            console.log(`🚀 Initializing ${this.name} v${this.version}`);
            
            // Initialize core components
            this.initializeTheme();
            this.initializeSearchEngine();
            this.initializeAnimations();
            this.initializeEventListeners();
            this.initializeUtilities();
            
            // Mark as initialized
            this.initialized = true;
            
            // Show welcome message
            this.showWelcomeMessage();
            
            console.log(`✅ ${this.name} initialized successfully`);
            
        } catch (error) {
            console.error('❌ Failed to initialize GSearch:', error);
            this.showError('Gagal memuat aplikasi. Silakan refresh halaman.');
        }
    }

    initializeTheme() {
        // Apply theme settings
        document.body.classList.add('gatotkaca-theme');
        
        // Set CSS custom properties for dynamic theming
        const root = document.documentElement;
        root.style.setProperty('--gatotkaca-gold', '#FFD700');
        root.style.setProperty('--cyber-blue', '#00FFFF');
        root.style.setProperty('--dark-space', '#0A0A0A');
        root.style.setProperty('--energy-purple', '#9D00FF');
        root.style.setProperty('--matrix-green', '#00FF41');
        
        // Add theme class to body
        document.body.classList.add('cyber-theme');
        
        console.log('🎨 Theme initialized');
    }

    initializeSearchEngine() {
        // Check if search engine is already initialized
        if (typeof window.gSearchEngine !== 'undefined') {
            console.log('🔍 Search engine already initialized');
            return;
        }
        
        // Search engine will be initialized by search.js
        // This method ensures proper initialization order
        console.log('🔍 Search engine initialization queued');
    }

    initializeAnimations() {
        // Check if animation engine is already initialized
        if (typeof window.gAnimationEngine !== 'undefined') {
            console.log('✨ Animation engine already initialized');
            return;
        }
        
        // Animation engine will be initialized by animations.js
        // This method ensures proper initialization order
        console.log('✨ Animation engine initialization queued');
    }

    initializeEventListeners() {
        // Global event listeners
        window.addEventListener('load', () => {
            this.onPageLoad();
        });

        window.addEventListener('beforeunload', () => {
            this.onPageUnload();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Online/offline handling
        window.addEventListener('online', () => {
            this.onOnline();
        });

        window.addEventListener('offline', () => {
            this.onOffline();
        });

        console.log('🎯 Event listeners initialized');
    }

    initializeUtilities() {
        // Initialize utility functions
        this.utils = {
            // Format date/time
            formatDateTime: (date) => {
                return new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            },

            // Debounce function
            debounce: (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },

            // Throttle function
            throttle: (func, limit) => {
                let inThrottle;
                return function() {
                    const args = arguments;
                    const context = this;
                    if (!inThrottle) {
                        func.apply(context, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            },

            // Local storage helpers
            storage: {
                set: (key, value) => {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                    } catch (error) {
                        console.warn('Failed to save to localStorage:', error);
                    }
                },
                get: (key, defaultValue = null) => {
                    try {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : defaultValue;
                    } catch (error) {
                        console.warn('Failed to get from localStorage:', error);
                        return defaultValue;
                    }
                },
                remove: (key) => {
                    try {
                        localStorage.removeItem(key);
                    } catch (error) {
                        console.warn('Failed to remove from localStorage:', error);
                    }
                }
            },

            // URL helpers
            url: {
                getParams: () => {
                    const params = new URLSearchParams(window.location.search);
                    const result = {};
                    params.forEach((value, key) => {
                        result[key] = value;
                    });
                    return result;
                },
                setParam: (key, value) => {
                    const url = new URL(window.location);
                    url.searchParams.set(key, value);
                    window.history.pushState({}, '', url);
                }
            }
        };

        console.log('🛠️ Utilities initialized');
    }

    // Event handlers
    onPageLoad() {
        console.log('📄 Page fully loaded');
        
        // Add page loaded class
        document.body.classList.add('page-loaded');
        
        // Check for URL parameters
        const urlParams = this.utils.url.getParams();
        if (urlParams.q) {
            // Auto-search if query parameter exists
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = urlParams.q;
                    if (window.gSearchEngine) {
                        window.gSearchEngine.performSearch();
                    }
                }
            }, 1000);
        }
    }

    onPageUnload() {
        console.log('👋 Page unloading');
        
        // Cleanup animation engine
        if (window.gAnimationEngine) {
            window.gAnimationEngine.destroy();
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Ctrl/Cmd + /: Show help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showHelp();
        }

        // Escape: Clear results
        if (e.key === 'Escape') {
            if (window.gSearchEngine) {
                window.gSearchEngine.clearResults();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ Page hidden');
            // Pause animations when page is hidden
            if (window.gAnimationEngine) {
                // Animation engine should handle visibility changes
            }
        } else {
            console.log('👁️ Page visible');
            // Resume animations when page is visible
        }
    }

    onOnline() {
        console.log('🌐 App online');
        this.showSuccess('Koneksi internet tersedia');
    }

    onOffline() {
        console.log('📵 App offline');
        this.showError('Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.');
    }

    // UI helper methods
    showWelcomeMessage() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="success-message success-bounce">
                <i class="fas fa-bolt mr-2"></i>
                Selamat datang di GSearch - GatotKaca Cyber Modern!
                <br><small>Gunakan Ctrl+K untuk fokus pencarian</small>
            </div>
        `;
        
        const container = document.querySelector('.min-h-screen');
        if (container) {
            container.insertBefore(welcomeMessage, container.firstChild);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                welcomeMessage.style.opacity = '0';
                setTimeout(() => {
                    if (welcomeMessage.parentNode) {
                        welcomeMessage.parentNode.removeChild(welcomeMessage);
                    }
                }, 300);
            }, 5000);
        }
    }

    showHelp() {
        const helpContent = `
            <div class="help-modal">
                <div class="help-content">
                    <h3 class="text-xl font-bold mb-4 text-cyan-400">⚡ GSearch Help</h3>
                    <div class="space-y-2">
                        <p><kbd>Ctrl+K</kbd> - Fokus pencarian</p>
                        <p><kbd>Esc</kbd> - Hapus hasil pencarian</p>
                        <p><kbd>Ctrl+/</kbd> - Tampilkan bantuan</p>
                        <p><kbd>Enter</kbd> - Lakukan pencarian</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-700">
                        <p class="text-sm text-gray-400">
                            <i class="fas fa-microphone mr-2"></i>
                            Klik ikon mikrofon untuk pencarian suara
                        </p>
                    </div>
                    <button onclick="this.closest('.help-modal').remove()" 
                            class="mt-4 cyber-button">
                        Tutup
                    </button>
                </div>
            </div>
        `;
        
        const helpModal = document.createElement('div');
        helpModal.innerHTML = helpContent;
        helpModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        helpModal.onclick = (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        };
        
        document.body.appendChild(helpModal);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 error-message error-shake z-50';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 success-message success-bounce z-50';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }

    // Public methods
    getVersion() {
        return this.version;
    }

    getName() {
        return this.name;
    }

    isInitialized() {
        return this.initialized;
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const timing = performance.timing;
                const pageLoad = timing.loadEventEnd - timing.navigationStart;
                console.log(`⏱️ Page load time: ${pageLoad}ms`);
                
                // Store performance data
                this.utils.storage.set('performance', {
                    pageLoad: pageLoad,
                    timestamp: Date.now()
                });
            });
        }
    }
}

// Initialize the application
const gSearchApp = new GSearchApp();

// Make app globally available
window.gSearchApp = gSearchApp;

// Start performance monitoring
gSearchApp.startPerformanceMonitoring();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSearchApp;
}
