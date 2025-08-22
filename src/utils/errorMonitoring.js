/**
 * Error Monitoring Utility for Production
 * 
 * This utility provides a centralized way to handle errors in production.
 * It can be easily extended to integrate with services like Sentry, LogRocket, or DataDog.
 */

/**
 * Log error to monitoring service
 * @param {Error|string} error - The error to log
 * @param {Object} context - Additional context about the error
 * @param {string} severity - Error severity: 'low', 'medium', 'high', 'critical'
 */
export function logError(error, context = {}, severity = 'medium') {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: typeof error === 'string' ? error : error.message,
    stack: error?.stack,
    url: typeof window !== 'undefined' ? window.location.href : context.url,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    severity,
    context
  };

  // In development, log to console
  if (import.meta.env.DEV) {
    console.error('Error logged:', errorData);
    return;
  }

  // Production error handling
  try {
    // TODO: Replace with your preferred monitoring service
    // Examples:
    
    // For Sentry:
    // Sentry.captureException(error, { extra: context, level: severity });
    
    // For custom analytics:
    // analytics.track('error', errorData);
    
    // For now, we'll use a fallback approach
    sendErrorToEndpoint(errorData);
    
  } catch (monitoringError) {
    // Fallback: at least log to console if monitoring fails
    console.error('Monitoring service failed:', monitoringError);
    console.error('Original error:', errorData);
  }
}

/**
 * Send error to a custom endpoint (optional)
 * @param {Object} errorData - Error data to send
 */
async function sendErrorToEndpoint(errorData) {
  try {
    // Example: send to custom error logging endpoint
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    });
  } catch (fetchError) {
    // Silently fail - don't let error reporting break the app
  }
}

/**
 * Set up global error handlers for unhandled errors
 */
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return; // Server-side
  
  // Handle unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    logError(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'javascript_error'
    }, 'high');
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, {
      type: 'unhandled_promise_rejection'
    }, 'high');
  });
}

/**
 * Log performance issues
 * @param {string} metric - Performance metric name
 * @param {number} value - Metric value
 * @param {Object} context - Additional context
 */
export function logPerformanceIssue(metric, value, context = {}) {
  // Only log if performance is degraded
  const thresholds = {
    'page_load_time': 3000, // 3 seconds
    'api_response_time': 5000, // 5 seconds
    'component_render_time': 100 // 100ms
  };

  if (value > (thresholds[metric] || 1000)) {
    logError(`Performance issue: ${metric} took ${value}ms`, {
      metric,
      value,
      threshold: thresholds[metric],
      ...context
    }, 'medium');
  }
}

/**
 * Log user actions for debugging context
 * @param {string} action - User action
 * @param {Object} data - Action data
 */
export function logUserAction(action, data = {}) {
  if (import.meta.env.DEV) {
    console.log('User action:', action, data);
  }
  
  // In production, you might want to log user actions for debugging context
  // This helps understand what led to an error
}