// Optimized Performance Boost for Lakshmi Trails
(function() {
  'use strict';

  class LakshmiTrailsPerformance {
    constructor() {
      this.observers = new Map();
      this.animatedElements = new Set();
      this.videosInitialized = new Set();
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
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.setupCore(), { timeout: 1000 });
      } else {
        setTimeout(() => this.setupCore(), 1);
      }
    }

    setupCore() {
      this.initializeSectionAnimations();
      this.initializeFAQAccordion();
      this.enhanceVideos();
      this.enhanceScrolling();
      this.enhanceFormValidation();
      this.trackPerformance();
    }

    // Section Animations
    initializeSectionAnimations() {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
              requestAnimationFrame(() => {
                entry.target.classList.add('intersecting');
                this.animatedElements.add(entry.target);
              });
              animationObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '20px' }
      );

      const animatedSelectors = [
        '.guide-header', '.guide-container', '.philosophy-content', '.philosophy-header',
        '.principles-container', '.tours-header', '.tours-footer', '.faq-header', '.faq-item',
        '.contact-header', '.credential-item', '.principle-card', '.section-header',
        '.overview-content', '.reserve-content', '.other-journeys-grid'
      ].join(', ');

      document.querySelectorAll(animatedSelectors).forEach(el => {
        if (el) animationObserver.observe(el);
      });

      this.observers.set('animations', animationObserver);
    }

    // FAQ Accordion
    initializeFAQAccordion() {
      const faqSection = document.querySelector('#faq');
      if (!faqSection) return;

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

    // Video Enhancement
    enhanceVideos() {
      const videos = document.querySelectorAll('video');
      
      videos.forEach(video => {
        if (video.classList.contains('hero-video')) {
          this.handleHeroVideo(video);
        } else if (video.closest('#guide')) {
          this.handleGuideVideo(video);
        }
      });
    }

    handleHeroVideo(video) {
      const heroObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.videosInitialized.has(video)) {
          this.videosInitialized.add(video);
          video.addEventListener('canplay', () => this.playVideoSafely(video), { once: true });
          heroObserver.unobserve(video);
        }
      }, { threshold: 0.25, rootMargin: '50px' });

      heroObserver.observe(video);
      this.observers.set('hero-video', heroObserver);
    }

    handleGuideVideo(video) {
      video.addEventListener('loadeddata', () => {
        video.setAttribute('loaded', '');
      }, { once: true });

      const guideObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.playVideoSafely(video);
        } else {
          video.pause();
        }
      }, { threshold: 0.1 });

      guideObserver.observe(video);
      this.observers.set('guide-video', guideObserver);
    }

    playVideoSafely(video) {
      video.play().catch(() => {
        console.warn('Video autoplay failed');
      });
    }

    // Smooth Scrolling
    enhanceScrolling() {
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          const headerOffset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, '', `#${targetId}`);
        }
      });
    }

    // Form Validation
    enhanceFormValidation() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
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
      const firstError = form.querySelector('input[style*="border-color: rgb(220, 53, 69)"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }

    // Performance Tracking (for Google Analytics)
    trackPerformance() {
      if ('PerformanceObserver' in window) {
        try {
          // LCP tracking
          const lcpObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
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

      // Simplified scroll depth tracking
      let maxScroll = 0;
      const scrollHandler = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if ([25, 50, 75, 90].includes(scrollPercent) && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
              'custom_parameter': scrollPercent
            });
          }
        }
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // Cleanup
    cleanup() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();
    }
  }

  // Initialize
  window.LakshmiTrailsPerformance = new LakshmiTrailsPerformance();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.LakshmiTrailsPerformance) {
      window.LakshmiTrailsPerformance.cleanup();
    }
  });

})();