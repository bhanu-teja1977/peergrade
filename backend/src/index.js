const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

/**
 * CORS CONFIGURATION FOR DEPLOYMENT
 * ----------------------------------
 * - Allows Vercel production frontend + localhost for development
 * - Same config for normal + preflight requests
 */
const allowedOrigins = [
    config.cors.frontendUrl,
    'http://localhost:5173',
    'http://localhost:5174',
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, health checks)
        if (!origin) return callback(null, true);
        // Allow any Vercel preview/production URL or whitelisted origins
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }
        callback(null, true); // Allow all for now (tighten post-launch)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
};

// ✅ APPLY SAME CORS CONFIG EVERYWHERE
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.server.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'PeerGrade Connect API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
    console.log(`
🚀 PeerGrade Backend Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${config.server.nodeEnv}
🌐 Server Port: ${PORT}
📚 API Base:    /api
❤️  Health:     /api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

module.exports = app;
