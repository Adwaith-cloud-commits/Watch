// Scroll-based Animation for Hero Section
class ScrollAnimation {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.frames = document.querySelectorAll('.hero-frame');
        this.currentFrame = 0;
        this.totalFrames = this.frames.length;
        this.scrollProgress = 0;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Show first frame initially
        if (this.frames.length > 0) {
            this.frames[0].classList.add('active');
        }
        
        // Bind scroll event with throttling
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Handle touch devices
        window.addEventListener('touchmove', this.throttle(this.handleScroll.bind(this), 16), { passive: true });
        
        // Initial check
        this.handleScroll();
        
        console.log('Scroll animation initialized');
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    handleScroll() {
        if (!this.heroSection) return;
        
        const heroRect = this.heroSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const heroHeight = this.heroSection.offsetHeight;
        
        // Calculate scroll progress through the hero section
        const scrollStart = 0;
        const scrollEnd = heroHeight - windowHeight;
        
        if (scrollEnd <= 0) {
            // Hero section is smaller than viewport, show all frames equally
            this.scrollProgress = 0;
        } else {
            // Calculate how far we've scrolled through the hero section
            const scrolled = -heroRect.top;
            this.scrollProgress = Math.max(0, Math.min(1, scrolled / scrollEnd));
        }
        
        // Determine current frame based on scroll progress
        const targetFrame = Math.floor(this.scrollProgress * (this.totalFrames - 1 + 0.999));
        const clampedTargetFrame = Math.min(targetFrame, this.totalFrames - 1);
        
        if (clampedTargetFrame !== this.currentFrame && !this.isAnimating) {
            this.transitionToFrame(clampedTargetFrame);
        }
        
        // Update watch rotation based on scroll
        this.updateWatchAnimation();
    }
    
    transitionToFrame(frameIndex) {
        this.isAnimating = true;
        
        // Remove active class from all frames
        this.frames.forEach(frame => {
            frame.classList.remove('active');
        });
        
        // Add active class to target frame
        if (this.frames[frameIndex]) {
            this.frames[frameIndex].classList.add('active');
            this.currentFrame = frameIndex;
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600); // Match CSS transition duration
    }
    
    updateWatchAnimation() {
        // Add subtle rotation based on scroll
        const watches = document.querySelectorAll('.watch');
        watches.forEach((watch, index) => {
            if (index === 0) {
                const rotation = this.scrollProgress * 360;
                watch.style.transform = `rotateY(${rotation}deg)`;
            }
        });
    }
}

// Product Management
class ProductManager {
    constructor() {
        this.productsGrid = document.getElementById('productsGrid');
        this.apiBase = '/api';
        this.init();
    }
    
    async init() {
        await this.loadProducts();
    }
    
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiBase}/products`);
            if (!response.ok) throw new Error('Failed to load products');
            
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError();
        }
    }
    
    renderProducts(products) {
        if (!this.productsGrid) return;
        
        this.productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <div class="product-placeholder">⌚</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <ul class="product-features">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <button class="btn btn-primary btn-full" onclick="ProductManager.inquire('${product.name}')">
                        Inquire Now
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    showError() {
        if (!this.productsGrid) return;
        
        this.productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <h3>Unable to load products</h3>
                <p style="color: var(--color-text-muted); margin-top: 1rem;">Please try again later</p>
            </div>
        `;
    }
    
    static inquire(productName) {
        const contactSection = document.getElementById('contact');
        const messageField = document.getElementById('message');
        
        if (messageField) {
            messageField.value = `I'm interested in the ${productName}. Please provide more information.`;
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.apiBase = '/api';
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            this.setLoading(true);
            
            const response = await fetch(`${this.apiBase}/inquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit inquiry');
            }
            
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
            submitBtn.classList.toggle('loading', loading);
        }
    }
    
    showSuccess() {
        const existingMessage = this.form.querySelector('.success-message');
        if (existingMessage) existingMessage.remove();
        
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Thank you! Your inquiry has been sent successfully.';
        this.form.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
    
    showError(message) {
        const existingMessage = this.form.querySelector('.success-message');
        if (existingMessage) existingMessage.remove();
        
        const message = document.createElement('div');
        message.className = 'success-message';
        message.style.background = 'rgba(255, 71, 87, 0.1)';
        message.style.borderColor = '#ff4757';
        message.textContent = `Error: ${message}`;
        this.form.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
}

// Navigation Handler
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-links a');
        
        this.init();
    }
    
    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Smooth scroll for nav links
        this.links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
        
        // Initial scroll check
        this.handleScroll();
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        if (window.scrollY > 50) {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            this.navbar.style.boxShadow = 'none';
        }
    }
    
    toggleMobileMenu() {
        if (!this.navLinks) return;
        
        this.navLinks.style.display = 
            this.navLinks.style.display === 'flex' ? 'none' : 'flex';
        
        // Animate hamburger
        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = 
            this.navLinks.style.display === 'flex' ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = 
            this.navLinks.style.display === 'flex' ? '0' : '1';
        spans[2].style.transform = 
            this.navLinks.style.display === 'flex' ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
    }
    
    handleLinkClick(e) {
        const href = this.links[0].getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    this.navLinks.style.display = 'none';
                    const spans = this.navToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            }
        }
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Reduce motion for users who prefer it
        this.checkReducedMotion();
        
        // Optimize animations on low power mode
        this.checkPowerMode();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    checkReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.documentElement.style.setProperty('--transition-smooth', 'none');
            document.documentElement.style.setProperty('--transition-fast', 'none');
            
            // Disable animations
            const animatedElements = document.querySelectorAll('.watch, .bubble, .hr-line');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
            });
        }
    }
    
    checkPowerMode() {
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                if (navigator.connection.saveData) {
                    // Reduce animation complexity
                    document.body.classList.add('low-power-mode');
                }
            });
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('CHRONOS - Initializing...');
    
    // Initialize all modules
    new ScrollAnimation();
    new ProductManager();
    new ContactForm();
    new Navigation();
    new PerformanceOptimizer();
    
    console.log('CHRONOS - Ready');
});

// Service Worker Registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
