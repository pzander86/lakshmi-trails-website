// Safe JavaScript Optimizations - Won't affect your CSS/styling
// Add this as a new file: /src/js/performance-boost.js

(function() {
    'use strict';
  
    // =====================================
    // PERFORMANCE OPTIMIZATIONS ONLY
    // =====================================
  
    class SafePerformanceBooster {
      constructor() {
        this.observers = new Map();
        this.loadedResources = new Set();
        this.init();
      }
  
      init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
          this.setup();
        }
      }
  
      setup() {
        this.enhanceImages();
        this.enhanceVideos();
        this.enhanceScrolling();
        this.enhanceFormValidation();
        this.setupErrorHandling();
        this.trackPerformance();
      }
  
      // =====================================
      // IMAGE OPTIMIZATION
      // =====================================
      enhanceImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
  
        const imageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.loadImage(entry.target);
                imageObserver.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '50px', threshold: 0.01 }
        );
  
        images.forEach(img => imageObserver.observe(img));
        this.observers.set('images', imageObserver);
      }
  
      loadImage(img) {
        const src = img.dataset.src;
        if (!src || this.loadedResources.has(src)) return;
  
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = src;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          setTimeout(() => img.style.opacity = '1', 10);
          this.loadedResources.add(src);
        };
        tempImg.onerror = () => {
          console.warn('Failed to load image:', src);
        };
        tempImg.src = src;
      }
  
      // =====================================
      // VIDEO OPTIMIZATION
      // =====================================
      enhanceVideos() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
          this.optimizeVideo(video);
        });
      }
  
      optimizeVideo(video) {
        // Better connection handling
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
        if (isSlowConnection || prefersReducedMotion) {
          video.preload = 'none';
          video.removeAttribute('autoplay');
          return;
        }
  
        // Enhanced intersection observer for videos
        const videoObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (video.readyState >= 2) {
                this.playVideoSafely(video);
              } else {
                video.addEventListener('canplay', () => this.playVideoSafely(video), { once: true });
              }
            } else {
              video.pause();
            }
          },
          { threshold: 0.25, rootMargin: '25px' }
        );
  
        videoObserver.observe(video);
      }
  
      playVideoSafely(video) {
        video.play().catch(error => {
          console.warn('Video autoplay failed:', error);
        });
      }
  
      // =====================================
      // SMOOTH SCROLLING ENHANCEMENT
      // =====================================
      enhanceScrolling() {
        // Enhanced smooth scroll for anchor links
        document.addEventListener('click', (e) => {
          const anchor = e.target.closest('a[href^="#"]');
          if (!anchor) return;
  
          e.preventDefault();
          const targetId = anchor.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
  
          if (target) {
            const headerOffset = this.getHeaderOffset();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
  
            // Update URL without jumping
            history.pushState(null, '', `#${targetId}`);
  
            // Focus management for accessibility
            setTimeout(() => {
              target.focus({ preventScroll: true });
            }, 500);
          }
        });
      }
  
      getHeaderOffset() {
        const header = document.querySelector('header, nav');
        return header ? header.offsetHeight : 80;
      }
  
      // =====================================
      // FORM VALIDATION ENHANCEMENT
      // =====================================
      enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
          this.enhanceForm(form);
        });
      }
  
      enhanceForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
          // Real-time validation
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => this.clearFieldErrors(input));
        });
  
        // Enhanced form submission
        form.addEventListener('submit', (e) => {
          if (!this.validateForm(form)) {
            e.preventDefault();
            this.focusFirstError(form);
          }
        });
      }
  
      validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
  
        if (field.required && !value) {
          isValid = false;
          errorMessage = 'This field is required';
        }
  
        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
        }
  
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
      }
  
      showFieldValidation(field, isValid, message) {
        field.style.borderColor = isValid ? '#28a745' : '#dc3545';
        
        // Find or create error message element
        let errorElement = document.querySelector(`#${field.name}-error`);
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = `${field.name}-error`;
          errorElement.style.cssText = 'color: #dc3545; font-size: 0.85rem; margin-top: 0.25rem;';
          field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = isValid ? '' : message;
        errorElement.style.display = isValid ? 'none' : 'block';
      }
  
      clearFieldErrors(field) {
        field.style.borderColor = '';
        const errorElement = document.querySelector(`#${field.name}-error`);
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
  
      validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
  
        inputs.forEach(input => {
          if (!this.validateField(input)) {
            isValid = false;
          }
        });
  
        return isValid;
      }
  
      focusFirstError(form) {
        const firstError = form.querySelector('input[style*="border-color: rgb(220, 53, 69)"], select[style*="border-color: rgb(220, 53, 69)"], textarea[style*="border-color: rgb(220, 53, 69)"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
  
      // =====================================
      // PERFORMANCE TRACKING
      // =====================================
      trackPerformance() {
        // Core Web Vitals tracking
        if ('PerformanceObserver' in window) {
          try {
            // LCP tracking
            const lcpObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                console.log('LCP:', entry.startTime);
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'web_vitals', {
                    'event_category': 'Performance',
                    'event_label': 'LCP',
                    'value': Math.round(entry.startTime)
                  });
                }
              });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  
            // FID tracking
            const fidObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                const fid = entry.processingStart - entry.startTime;
                console.log('FID:', fid);
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'web_vitals', {
                    'event_category': 'Performance',
                    'event_label': 'FID',
                    'value': Math.round(fid)
                  });
                }
              });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
  
          } catch (e) {
            console.warn('Performance Observer not supported');
          }
        }
  
        // Track user engagement
        this.trackScrollDepth();
      }
  
      trackScrollDepth() {
        let maxScroll = 0;
        
        const scrollHandler = this.throttle(() => {
          const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
          if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if ([25, 50, 75, 90].includes(scrollPercent)) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                  'custom_parameter': scrollPercent
                });
              }
            }
          }
        }, 250);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
      }
  
      // =====================================
      // ERROR HANDLING
      // =====================================
      setupErrorHandling() {
        // Global error handling
        window.addEventListener('error', (e) => {
          console.error('Global error:', e.error);
        });
  
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
          console.error('Unhandled promise rejection:', e.reason);
        });
      }
  
      // =====================================
      // UTILITY METHODS
      // =====================================
      throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
          if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      }
  
      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }
  
      // =====================================
      // PRELOADING OPTIMIZATION
      // =====================================
      preloadCriticalResources() {
        // Preload critical images on user interaction
        let interactionStarted = false;
        
        const startPreloading = () => {
          if (interactionStarted) return;
          interactionStarted = true;
          
          // Preload next section images
          const images = document.querySelectorAll('img[data-src]');
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const preloadThreshold = scrollY + viewportHeight * 2;
  
          images.forEach(img => {
            const imgTop = img.getBoundingClientRect().top + scrollY;
            if (imgTop < preloadThreshold) {
              this.loadImage(img);
            }
          });
  
          // Remove listeners
          document.removeEventListener('mousedown', startPreloading);
          document.removeEventListener('touchstart', startPreloading);
        };
  
        document.addEventListener('mousedown', startPreloading, { passive: true });
        document.addEventListener('touchstart', startPreloading, { passive: true });
      }
  
      // =====================================
      // CLEANUP
      // =====================================
      cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
      }
    }
  
    // Initialize the performance booster
    window.LakshmiTrailsPerformance = new SafePerformanceBooster();
  
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (window.LakshmiTrailsPerformance) {
        window.LakshmiTrailsPerformance.cleanup();
      }
    });
  
  })();