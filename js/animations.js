/**
 * GSearch - GatotKaca Cyber Modern Animation System
 * Manages all visual effects, particles, and animations
 */

class GAnimationEngine {
    constructor() {
        this.particlesContainer = document.getElementById('particles-container');
        this.particles = [];
        this.animationFrameId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.initializeParticles();
        this.initializeEventListeners();
        this.startAnimationLoop();
        this.addEntranceAnimations();
    }

    initializeParticles() {
        // Create background grid
        this.createBackgroundGrid();
        
        // Create floating particles
        this.createFloatingParticles();
        
        // Create GatotKaca power aura
        this.createGatotkacaPowerAura();
    }

    createBackgroundGrid() {
        const grid = document.createElement('div');
        grid.className = 'cyber-grid-background';
        document.body.appendChild(grid);
    }

    createFloatingParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle cyber-particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            const duration = Math.random() * 8 + 6;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            this.particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createGatotkacaPowerAura() {
        const logo = document.querySelector('.text-6xl');
        if (logo) {
            const aura = document.createElement('div');
            aura.className = 'gatotkaca-power-aura';
            logo.parentElement.appendChild(aura);
        }
    }

    initializeEventListeners() {
        // Mouse movement effects
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateParticleMovement();
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Search input focus effects
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                this.enhanceSearchInput();
            });
            
            searchInput.addEventListener('blur', () => {
                this.removeSearchInputEnhancement();
            });
        }

        // Category button animations
        this.initializeCategoryButtonAnimations();
    }

    updateParticleMovement() {
        this.particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouseX - particleX, 2) + 
                Math.pow(this.mouseY - particleY, 2)
            );
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(particleY - this.mouseY, particleX - this.mouseX);
                const moveX = Math.cos(angle) * force * 20;
                const moveY = Math.sin(angle) * force * 20;
                
                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                particle.style.transform = 'translate(0, 0)';
            }
        });
    }

    handleWindowResize() {
        // Reposition particles on window resize
        this.particles.forEach(particle => {
            const currentLeft = parseFloat(particle.style.left);
            const currentTop = parseFloat(particle.style.top);
            
            if (currentLeft > window.innerWidth) {
                particle.style.left = `${Math.random() * window.innerWidth}px`;
            }
            
            if (currentTop > window.innerHeight) {
                particle.style.top = `${Math.random() * window.innerHeight}px`;
            }
        });
    }

    enhanceSearchInput() {
        const searchShield = document.querySelector('.search-shield');
        if (searchShield) {
            searchShield.classList.add('search-shield-pulse');
        }
    }

    removeSearchInputEnhancement() {
        const searchShield = document.querySelector('.search-shield');
        if (searchShield) {
            searchShield.classList.remove('search-shield-pulse');
        }
    }

    initializeCategoryButtonAnimations() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach((button, index) => {
            button.classList.add('category-btn-enter');
            
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                this.createButtonRipple(button);
            });
        });
    }

    createButtonRipple(button) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(0, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        const rect = button.getBoundingClientRect();
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addEntranceAnimations() {
        // Animate main container
        const mainContainer = document.querySelector('.min-h-screen');
        if (mainContainer) {
            mainContainer.classList.add('page-load-animation');
        }

        // Animate search shield
        const searchShield = document.querySelector('.search-shield');
        if (searchShield) {
            setTimeout(() => {
                searchShield.style.opacity = '1';
                searchShield.style.transform = 'translateY(0)';
            }, 300);
        }

        // Animate category buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 600 + (index * 100));
        });
    }

    startAnimationLoop() {
        const animate = () => {
            this.updateAnimations();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateAnimations() {
        // Update any continuous animations here
        this.updateParticleColors();
        this.updateLogoGlow();
    }

    updateParticleColors() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach((particle, index) => {
            const hue = (time * 50 + index * 10) % 360;
            const opacity = 0.3 + Math.sin(time * 2 + index) * 0.3;
            
            if (index % 3 === 0) {
                particle.style.background = `hsla(${hue}, 100%, 50%, ${opacity})`;
            }
        });
    }

    updateLogoGlow() {
        const logo = document.querySelector('.text-6xl');
        if (logo) {
            const time = Date.now() * 0.001;
            const intensity = 0.5 + Math.sin(time * 3) * 0.5;
            logo.style.filter = `drop-shadow(0 0 ${10 + intensity * 10}px rgba(255, 215, 0, ${0.8 + intensity * 0.2}))`;
        }
    }

    // Special effects methods
    createPowerBurst(x, y) {
        const burst = document.createElement('div');
        burst.style.position = 'fixed';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.style.width = '10px';
        burst.style.height = '10px';
        burst.style.background = 'var(--gatotkaca-gold)';
        burst.style.borderRadius = '50%';
        burst.style.pointerEvents = 'none';
        burst.style.animation = 'powerBurst 0.8s ease-out forwards';
        burst.style.zIndex = '1000';
        
        document.body.appendChild(burst);
        
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 800);
    }

    createSearchTrail() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 0) {
                    this.createPowerBurst(
                        searchInput.offsetLeft + searchInput.offsetWidth / 2,
                        searchInput.offsetTop + searchInput.offsetHeight / 2
                    );
                }
            });
        }
    }

    // Loading animation enhancements
    enhanceLoadingAnimation() {
        const loadingElement = document.getElementById('gatotkaca-loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div class="gatotkaca-loading-enhanced">
                    <div class="gatotkaca-loading-ring"></div>
                    <div class="gatotkaca-silhouette"></div>
                    <div class="gatotkaca-loading-text">GatotKaca sedang mencari...</div>
                </div>
            `;
        }
    }

    // Cleanup method
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove all particles
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.particles = [];
    }
}

// Initialize animation engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gAnimationEngine = new GAnimationEngine();
    
    // Add some interactive effects
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            window.gAnimationEngine.createPowerBurst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        });
    }
    
    // Add search trail effect
    window.gAnimationEngine.createSearchTrail();
    
    // Enhance loading animation
    window.gAnimationEngine.enhanceLoadingAnimation();
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes powerBurst {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(10);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAnimationEngine;
}
