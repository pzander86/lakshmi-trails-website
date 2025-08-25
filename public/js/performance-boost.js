// Enhanced Performance Boost for Lakshmi Trails
// Merges existing performance-boost.js with site-specific optimizations
// Replace your current performance-boost.js with this version

(function() {
  'use strict';

  class LakshmiTrailsPerformance {
    constructor() {
      this.observers = new Map();
      this.loadedResources = new Set();
      this.animatedElements = new Set();
      this.videosInitialized = new Set();
      
      // Configuration - optimized thresholds
      this.config = {
        animationThreshold: 0.1,
        animationRootMargin: '50px',
        videoThreshold: 0.15,
        videoRootMargin: '100px',
        headerOffset: 80,
        imageRootMargin: '100px'
      };
      
      // Performance tracking
      this.performanceMetrics = {
        lcp: null,
        fid: null,
        cls: null
      };
      
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      // Use requestIdleCallback for non-critical tasks
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.setupCore();
        }, { timeout: 2000 });
      } else {
        setTimeout(() => this.setupCore(), 1);
      }
    }

    setupCore() {
      // Critical site-specific functionality
      this.initializeSectionAnimations();
      this.initializeFAQAccordion();
      
      // Enhanced performance features
      this.enhanceImages();
      this.enhanceVideos();
      this.enhanceScrolling();
      this.enhanceFormValidation();
      this.setupErrorHandling();
      this.preloadCriticalResources();
      this.trackPerformance();
    }

    // =====================================
    // SECTION ANIMATIONS (NEW - CONSOLIDATED)
    // =====================================
    initializeSectionAnimations() {
      // Single observer for ALL animated sections - optimized for better performance
      const animationObserver = new IntersectionObserver(
        (entries) => {
          // Batch DOM writes to avoid layout thrashing
          const elementsToAnimate = [];
          
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
              elementsToAnimate.push(entry.target);
              this.animatedElements.add(entry.target);
              animationObserver.unobserve(entry.target);
            }
          });
          
          // Batch all class additions in a single frame
          if (elementsToAnimate.length > 0) {
            requestAnimationFrame(() => {
              elementsToAnimate.forEach(element => {
                element.classList.add('intersecting');
              });
            });
          }
        },
        {
          threshold: this.config.animationThreshold,
          rootMargin: this.config.animationRootMargin
        }
      );

      // Select ALL animated elements at once
      const animatedSelectors = [
        '.guide-header',
        '.guide-container',
        '.philosophy-content',
        '.philosophy-header',
        '.principles-container',
        '.tours-header',
        '.tours-footer',
        '.faq-header',
        '.faq-item',
        '.contact-header',
        '.credential-item',
        '.principle-card',
        // Tour page specific selectors
        '.section-header',
        '.overview-content',
        '.reserve-content',
        '.other-journeys-grid'
      ].join(', ');

      document.querySelectorAll(animatedSelectors).forEach(el => {
        if (el) animationObserver.observe(el);
      });

      this.observers.set('animations', animationObserver);
    }

    // =====================================
    // FAQ ACCORDION (NEW)
    // =====================================
    initializeFAQAccordion() {
      const faqSection = document.querySelector('#faq');
      if (!faqSection) return;

      // Event delegation for better performance
      faqSection.addEventListener('toggle', (e) => {
        if (e.target.tagName !== 'DETAILS') return;
        
        if (e.target.open) {
          const allDetails = faqSection.querySelectorAll('details');
          allDetails.forEach(details => {
            if (details !== e.target) {
              details.open = false;
            }
          });
        }
      }, true);
    }

    // =====================================
    // ENHANCED VIDEO OPTIMIZATION
    // =====================================
    enhanceVideos() {
      const videos = document.querySelectorAll('video');
      
      // Check connection once
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.saveData);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      videos.forEach(video => {
        // Special handling for hero video
        if (video.classList.contains('hero-video')) {
          this.handleHeroVideo(video, isSlowConnection, prefersReducedMotion);
        } 
        // Special handling for guide video
        else if (video.closest('#guide')) {
          this.handleGuideVideo(video);
        } 
        // Generic video optimization
        else {
          this.optimizeVideo(video, isSlowConnection, prefersReducedMotion);
        }
      });
    }

    handleHeroVideo(video, isSlowConnection, prefersReducedMotion) {
      const fallbackImage = document.querySelector('.hero-image-fallback');
      
      if (isSlowConnection || prefersReducedMotion) {
        this.showVideoFallback(video, fallbackImage);
        return;
      }

      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.videosInitialized.has(video)) {
            this.loadVideoSources(video);
            this.videosInitialized.add(video);
            
            video.addEventListener('canplay', () => {
              this.playVideoSafely(video);
            }, { once: true });
            
            heroObserver.unobserve(video);
          }
        },
        {
          threshold: this.config.videoThreshold,
          rootMargin: this.config.videoRootMargin
        }
      );

      heroObserver.observe(video);
      this.observers.set('hero-video', heroObserver);

      // Error handling
      video.addEventListener('error', () => this.showVideoFallback(video, fallbackImage), { once: true });
      video.addEventListener('stalled', () => this.showVideoFallback(video, fallbackImage), { once: true });
    }

    handleGuideVideo(video) {
      video.addEventListener('loadeddata', () => {
        video.setAttribute('loaded', '');
      }, { once: true });

      const guideObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.playVideoSafely(video);
          } else {
            video.pause();
          }
        },
        { threshold: 0.1 }
      );

      guideObserver.observe(video);
      this.observers.set('guide-video', guideObserver);
    }

    optimizeVideo(video, isSlowConnection, prefersReducedMotion) {
      if (isSlowConnection || prefersReducedMotion) {
        video.preload = 'none';
        video.removeAttribute('autoplay');
        return;
      }

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

    loadVideoSources(video) {
      const dataSrc = video.dataset.src;
      const sources = video.querySelectorAll('source[data-src]');
      
      if (dataSrc) {
        const useHighQuality = window.innerWidth > 768;
        
        sources.forEach(source => {
          const srcToUse = useHighQuality ? 
            source.dataset.src : 
            source.dataset.src.replace('.webm', '-720p.webm').replace('.mp4', '-720p.mp4');
          source.src = srcToUse;
        });
        
        video.load();
      }
    }

    showVideoFallback(video, fallbackImage) {
      if (video) video.classList.add('error');
      if (fallbackImage) fallbackImage.classList.add('show');
    }

    playVideoSafely(video) {
      video.play().catch(error => {
        console.warn('Video autoplay failed:', error);
        const fallback = video.parentElement.querySelector('.hero-image-fallback');
        if (fallback) this.showVideoFallback(video, fallback);
      });
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
        { rootMargin: this.config.imageRootMargin, threshold: 0.01 }
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
    // SMOOTH SCROLLING ENHANCEMENT - OPTIMIZED
    // =====================================
    enhanceScrolling() {
      // Cache header offset to avoid repeated DOM reads
      this.cachedHeaderOffset = null;
      
      // Delegate all anchor link clicks
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          // Use requestAnimationFrame to batch DOM operations
          requestAnimationFrame(() => {
            const headerOffset = this.getHeaderOffset();
            // Single DOM read - batch all measurements
            const rect = target.getBoundingClientRect();
            const currentScrollY = window.pageYOffset;
            const targetPosition = rect.top + currentScrollY - headerOffset;

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
          });
        }
      });

      // Special handling for CTA button - optimized
      const ctaButton = document.querySelector('.cta-button');
      if (ctaButton && ctaButton.getAttribute('href')?.startsWith('#')) {
        ctaButton.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = ctaButton.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            // Batch DOM operations in requestAnimationFrame
            requestAnimationFrame(() => {
              const headerOffset = this.getHeaderOffset();
              const currentScrollY = window.pageYOffset;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + currentScrollY - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            });
          }
        });
      }
    }

    getHeaderOffset() {
      // Cache header offset to prevent repeated DOM reads
      if (this.cachedHeaderOffset === null) {
        const header = document.querySelector('header, nav');
        this.cachedHeaderOffset = header ? header.offsetHeight : this.config.headerOffset;
      }
      return this.cachedHeaderOffset;
    }

    // =====================================
    // FORM VALIDATION ENHANCEMENT
    // =====================================
    enhanceFormValidation() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => this.enhanceForm(form));
    }

    enhanceForm(form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldErrors(input));
      });

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

      this.trackScrollDepth();
    }

    trackScrollDepth() {
      let maxScroll = 0;
      let cachedDocumentHeight = null;
      let cachedWindowHeight = null;
      
      // Cache dimensions to avoid repeated DOM reads
      const updateCachedDimensions = this.debounce(() => {
        cachedDocumentHeight = document.body.scrollHeight;
        cachedWindowHeight = window.innerHeight;
      }, 500);
      
      // Initial cache
      updateCachedDimensions();
      window.addEventListener('resize', updateCachedDimensions, { passive: true });
      
      const scrollHandler = this.throttle(() => {
        // Use cached values or fallback to current values if cache is stale
        const documentHeight = cachedDocumentHeight || document.body.scrollHeight;
        const windowHeight = cachedWindowHeight || window.innerHeight;
        
        const scrollPercent = Math.round((window.scrollY / (documentHeight - windowHeight)) * 100);
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
      window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
      });

      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
      });
    }

    // =====================================
    // PRELOADING OPTIMIZATION
    // =====================================
    preloadCriticalResources() {
      // Preload next section assets based on connection
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const effectiveType = connection?.effectiveType || '4g';
      
      if (effectiveType === '4g' || effectiveType === '3g') {
        setTimeout(() => {
          this.preloadNextSectionImages();
        }, 3000);
      }

      // Preload on user interaction - optimized to avoid forced reflows
      let interactionStarted = false;
      
      const startPreloading = () => {
        if (interactionStarted) return;
        interactionStarted = true;
        
        // Batch DOM reads using requestAnimationFrame
        requestAnimationFrame(() => {
          const images = document.querySelectorAll('img[data-src]');
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const preloadThreshold = scrollY + viewportHeight * 2;

          // Batch all getBoundingClientRect calls
          const imagePositions = Array.from(images).map(img => ({
            element: img,
            top: img.getBoundingClientRect().top + scrollY
          }));

          // Process images without additional DOM reads
          imagePositions.forEach(({ element, top }) => {
            if (top < preloadThreshold) {
              this.loadImage(element);
            }
          });
        });

        document.removeEventListener('mousedown', startPreloading);
        document.removeEventListener('touchstart', startPreloading);
      };

      document.addEventListener('mousedown', startPreloading, { passive: true });
      document.addEventListener('touchstart', startPreloading, { passive: true });
    }

    preloadNextSectionImages() {
      const imagesToPreload = document.querySelectorAll('#guide img[data-src], #about img[data-src]');
      
      imagesToPreload.forEach(img => {
        if (img.dataset.src && !img.src) {
          const preloadImg = new Image();
          preloadImg.src = img.dataset.src;
        }
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
    // CLEANUP
    // =====================================
    cleanup() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();
    }
  }

  // Initialize the performance booster
  window.LakshmiTrailsPerformance = new LakshmiTrailsPerformance();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.LakshmiTrailsPerformance) {
      window.LakshmiTrailsPerformance.cleanup();
    }
  });

})();