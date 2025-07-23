import client from 'prom-client';

// Create a Registry to register metrics
const register = new client.Registry();

// Add default system metrics
client.collectDefaultMetrics({
    register,
    prefix: 'brainbytes_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // GC duration buckets
    eventLoopMonitoringPrecision: 10 // Event loop monitoring precision
});

// ======================
// CUSTOM METRICS
// ======================

// 1. HTTP Request Metrics
const httpRequestDuration = new client.Histogram({
    name: 'brainbytes_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // Response time buckets
});

const httpRequestsTotal = new client.Counter({
    name: 'brainbytes_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

// 2. Chat/AI Metrics
const chatMessagesTotal = new client.Counter({
    name: 'brainbytes_chat_messages_total',
    help: 'Total number of chat messages sent',
    labelNames: ['user_type', 'message_type'] // user_type: student/teacher, message_type: question/answer
});

const aiResponseTime = new client.Histogram({
    name: 'brainbytes_ai_response_time_seconds',
    help: 'AI response generation time in seconds',
    labelNames: ['model', 'subject'],
    buckets: [0.5, 1, 2, 3, 5, 10, 15, 30] // AI response time buckets
});

const aiResponsesTotal = new client.Counter({
    name: 'brainbytes_ai_responses_total',
    help: 'Total number of AI responses generated',
    labelNames: ['model', 'subject', 'success']
});

// 3. User Activity Metrics
const activeUsers = new client.Gauge({
    name: 'brainbytes_active_users',
    help: 'Number of currently active users',
    labelNames: ['session_type'] // online/offline
});

const userSessions = new client.Counter({
    name: 'brainbytes_user_sessions_total',
    help: 'Total number of user sessions',
    labelNames: ['login_type', 'device_type'] // login_type: google/manual, device_type: mobile/desktop
});

const studySessionDuration = new client.Histogram({
    name: 'brainbytes_study_session_duration_seconds',
    help: 'Study session duration in seconds',
    labelNames: ['subject', 'completion_status'],
    buckets: [60, 300, 600, 1200, 1800, 3600] // 1min, 5min, 10min, 20min, 30min, 1hour
});

// 4. Educational Content Metrics
const subjectPopularity = new client.Counter({
    name: 'brainbytes_subject_requests_total',
    help: 'Total requests per subject',
    labelNames: ['subject', 'grade_level']
});

const learningMaterialViews = new client.Counter({
    name: 'brainbytes_learning_material_views_total',
    help: 'Total views of learning materials',
    labelNames: ['material_type', 'subject']
});

// 5. Filipino Context Metrics (Mobile-First Design)
const mobileUsage = new client.Gauge({
    name: 'brainbytes_mobile_users_percentage',
    help: 'Percentage of users on mobile devices',
    labelNames: ['region', 'connection_type'] // region: metro_manila/provinces, connection_type: wifi/mobile_data
});

const connectionQuality = new client.Histogram({
    name: 'brainbytes_connection_speed_mbps',
    help: 'User connection speed in Mbps',
    labelNames: ['region', 'provider', 'connection_type'],
    buckets: [0.5, 1, 2, 5, 10, 25, 50, 100] // Connection speed buckets
});

const offlineUsage = new client.Counter({
    name: 'brainbytes_offline_usage_total',
    help: 'Total offline usage instances',
    labelNames: ['feature', 'region']
});

const dataTransfer = new client.Counter({
    name: 'brainbytes_data_transfer_bytes_total',
    help: 'Total data transfer in bytes',
    labelNames: ['direction', 'content_type'] // direction: inbound/outbound, content_type: text/image/video
});

// 6. Database Metrics
const mongoQueries = new client.Counter({
    name: 'brainbytes_mongo_queries_total',
    help: 'Total MongoDB queries',
    labelNames: ['operation', 'collection']
});

const mongoQueryDuration = new client.Histogram({
    name: 'brainbytes_mongo_query_duration_seconds',
    help: 'MongoDB query duration in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

// 7. Error Metrics
const errorRate = new client.Counter({
    name: 'brainbytes_errors_total',
    help: 'Total number of errors',
    labelNames: ['error_type', 'severity', 'component']
});

const failedRequests = new client.Counter({
    name: 'brainbytes_failed_requests_total',
    help: 'Total number of failed requests',
    labelNames: ['error_code', 'endpoint']
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(chatMessagesTotal);
register.registerMetric(aiResponseTime);
register.registerMetric(aiResponsesTotal);
register.registerMetric(activeUsers);
register.registerMetric(userSessions);
register.registerMetric(studySessionDuration);
register.registerMetric(subjectPopularity);
register.registerMetric(learningMaterialViews);
register.registerMetric(mobileUsage);
register.registerMetric(connectionQuality);
register.registerMetric(offlineUsage);
register.registerMetric(dataTransfer);
register.registerMetric(mongoQueries);
register.registerMetric(mongoQueryDuration);
register.registerMetric(errorRate);
register.registerMetric(failedRequests);

// ======================
// HELPER FUNCTIONS
// ======================

// Track HTTP requests
export const trackHttpRequest = (req, res, duration) => {
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode;

    httpRequestDuration.observe(
        { method, route, status_code: statusCode },
        duration
    );
    
    httpRequestsTotal.inc({
        method,
        route,
        status_code: statusCode
    });
};

// Track chat messages
export const trackChatMessage = (userType, messageType) => {
    chatMessagesTotal.inc({
        user_type: userType,
        message_type: messageType
    });
};

// Track AI responses
export const trackAIResponse = (model, subject, duration, success) => {
    aiResponseTime.observe(
        { model, subject },
        duration
    );
    
    aiResponsesTotal.inc({
        model,
        subject,
        success: success ? 'true' : 'false'
    });
};

// Track user sessions
export const trackUserSession = (loginType, deviceType) => {
    userSessions.inc({
        login_type: loginType,
        device_type: deviceType
    });
};

// Track subject popularity
export const trackSubjectRequest = (subject, gradeLevel) => {
    subjectPopularity.inc({
        subject,
        grade_level: gradeLevel
    });
};

// Track Filipino context metrics
export const trackMobileUsage = (region, connectionType, percentage) => {
    mobileUsage.set(
        { region, connection_type: connectionType },
        percentage
    );
};

export const trackConnectionQuality = (region, provider, connectionType, speedMbps) => {
    connectionQuality.observe(
        { region, provider, connection_type: connectionType },
        speedMbps
    );
};

// Track errors
export const trackError = (errorType, severity, component) => {
    errorRate.inc({
        error_type: errorType,
        severity,
        component
    });
};

// Track MongoDB operations
export const trackMongoQuery = (operation, collection, duration) => {
    mongoQueries.inc({
        operation,
        collection
    });
    
    mongoQueryDuration.observe(
        { operation, collection },
        duration
    );
};

// Export the register for /metrics endpoint
export { register };
