import { trackHttpRequest, trackError } from '../metrics.js';

// Middleware to track HTTP requests
export const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.end to capture metrics when response is sent
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        
        try {
            trackHttpRequest(req, res, duration);
        } catch (error) {
            console.error('Error tracking HTTP request metrics:', error);
            trackError('metrics_tracking', 'error', 'middleware');
        }
        
        // Call original end method
        originalEnd.apply(res, args);
    };
    
    next();
};

// Middleware to detect device type
export const deviceDetectionMiddleware = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    
    // Simple device detection
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/.test(userAgent);
    req.deviceType = isMobile ? 'mobile' : 'desktop';
    
    // Simple region detection (you can enhance this with IP geolocation)
    const acceptLanguage = req.get('Accept-Language') || '';
    req.region = acceptLanguage.includes('fil') || acceptLanguage.includes('tl') ? 'philippines' : 'other';
    
    next();
};

// Error handling middleware with metrics
export const errorMetricsMiddleware = (err, req, res, next) => {
    const errorType = err.name || 'UnknownError';
    const severity = err.status >= 500 ? 'critical' : 'warning';
    const component = 'backend';
    
    trackError(errorType, severity, component);
    
    // Log error for debugging
    console.error('Error caught by metrics middleware:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    next(err);
};
