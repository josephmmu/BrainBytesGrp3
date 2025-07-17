import client from 'prom-client';
import express from 'express';

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestCounter = new client.Counter({
  name: 'brainbytes_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'endpoint', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'brainbytes_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'endpoint', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

const activeSessionsGauge = new client.Gauge({
  name: 'brainbytes_active_sessions',
  help: 'Number of active tutoring sessions',
  registers: [register]
});

// Initialize with 0 active sessions
activeSessionsGauge.set(0);

// Export metrics endpoint
const metricsApp = express();
metricsApp.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});



// Middleware to track HTTP requests in your main app
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  // Add response finish listener
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    // Record metrics
    httpRequestCounter.inc({
      method: req.method,
      endpoint: req.path,
      status: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      endpoint: req.path,
      status: res.statusCode
    }, duration);
  });
  
  next();
}

// Functions to track active sessions
function incrementActiveSessions() {
  activeSessionsGauge.inc();
}

function decrementActiveSessions() {
  activeSessionsGauge.dec();
}

// module.exports = {
//   metricsMiddleware,
//   incrementActiveSessions,
//   decrementActiveSessions
// };


export { metricsMiddleware, incrementActiveSessions, decrementActiveSessions }
