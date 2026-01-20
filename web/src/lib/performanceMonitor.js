/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and custom metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: {},
      resources: [],
      vitals: {},
      custom: {}
    };
    this.observers = [];
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeCLS();
    this.observeLCP();
    this.observeFID();
    this.observeFCP();
    this.observeTTFB();

    // Monitor navigation timing
    this.captureNavigationTiming();

    // Monitor resource timing
    this.captureResourceTiming();
  }

  // Cumulative Layout Shift (CLS)
  observeCLS() {
    if (!('LayoutShift' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.vitals.cls = clsValue;
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    this.observers.push(observer);
  }

  // Largest Contentful Paint (LCP)
  observeLCP() {
    if (!('LargestContentfulPaint' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    this.observers.push(observer);
  }

  // First Input Delay (FID)
  observeFID() {
    if (!('PerformanceEventTiming' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.vitals.fid = entry.processingStart - entry.startTime;
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
    this.observers.push(observer);
  }

  // First Contentful Paint (FCP)
  observeFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.vitals.fcp = entry.startTime;
        }
      }
    });

    observer.observe({ type: 'paint', buffered: true });
    this.observers.push(observer);
  }

  // Time to First Byte (TTFB)
  observeTTFB() {
    if (!window.performance?.timing) return;

    const { requestStart, responseStart } = window.performance.timing;
    this.metrics.vitals.ttfb = responseStart - requestStart;
  }

  // Navigation Timing
  captureNavigationTiming() {
    if (!window.performance?.timing) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        this.metrics.navigation = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          dom: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
          load: timing.loadEventEnd - timing.loadEventStart,
          total: timing.loadEventEnd - timing.navigationStart
        };
      }, 0);
    });
  }

  // Resource Timing
  captureResourceTiming() {
    if (!window.performance?.getEntriesByType) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = window.performance.getEntriesByType('resource');
        this.metrics.resources = resources.map(resource => ({
          name: resource.name,
          type: resource.initiatorType,
          duration: resource.duration,
          size: resource.transferSize,
          cached: resource.transferSize === 0
        }));
      }, 0);
    });
  }

  // Custom metrics
  mark(name) {
    if (window.performance?.mark) {
      window.performance.mark(name);
    }
  }

  measure(name, startMark, endMark) {
    if (window.performance?.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        this.metrics.custom[name] = measure.duration;
        return measure.duration;
      } catch (e) {
        console.warn('Performance measurement failed:', e);
      }
    }
    return null;
  }

  // Get all metrics
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  // Get Core Web Vitals summary
  getWebVitals() {
    return this.metrics.vitals;
  }

  // Check if metrics meet thresholds
  checkThresholds() {
    const { cls, lcp, fid, fcp } = this.metrics.vitals;
    
    return {
      cls: {
        value: cls,
        rating: cls < 0.1 ? 'good' : cls < 0.25 ? 'needs-improvement' : 'poor',
        threshold: 0.1
      },
      lcp: {
        value: lcp,
        rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor',
        threshold: 2500
      },
      fid: {
        value: fid,
        rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor',
        threshold: 100
      },
      fcp: {
        value: fcp,
        rating: fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor',
        threshold: 1800
      }
    };
  }

  // Log metrics to console (dev only)
  logMetrics() {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('🚀 Performance Metrics');
    console.table(this.getWebVitals());
    console.table(this.checkThresholds());
    console.log('Navigation Timing:', this.metrics.navigation);
    console.log('Custom Metrics:', this.metrics.custom);
    console.groupEnd();
  }

  // Export metrics as JSON
  exportMetrics() {
    return JSON.stringify(this.getMetrics(), null, 2);
  }

  // Send metrics to analytics service
  sendToAnalytics(endpoint) {
    if (!endpoint) return;

    const metrics = this.getMetrics();
    
    if (navigator.sendBeacon) {
      // Use sendBeacon for better reliability
      navigator.sendBeacon(endpoint, JSON.stringify(metrics));
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
        keepalive: true
      }).catch(err => console.warn('Failed to send metrics:', err));
    }
  }

  // Cleanup
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Report on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.logMetrics();
    
    // Optional: Send to analytics endpoint
    // performanceMonitor.sendToAnalytics('/api/analytics/performance');
  });
}

export default performanceMonitor;

// Helper function for React components
export const usePerformanceMonitor = () => {
  return {
    mark: (name) => performanceMonitor.mark(name),
    measure: (name, start, end) => performanceMonitor.measure(name, start, end),
    getMetrics: () => performanceMonitor.getMetrics(),
    getWebVitals: () => performanceMonitor.getWebVitals(),
    checkThresholds: () => performanceMonitor.checkThresholds()
  };
};
