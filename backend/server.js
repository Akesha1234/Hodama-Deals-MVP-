const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Load env vars ──
dotenv.config();

// ── Connect to MongoDB ──
connectDB();

// ── Create Express app ──
const app = express();

// ═══════════════════════════════════════════
// GLOBAL MIDDLEWARE
// ═══════════════════════════════════════════

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
);

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ═══════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// ── Health check ──
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🟢 Hodama Deals API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ── 404 handler ──
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// ── Global error handler ──
app.use(errorHandler);

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║    🚀 Hodama Deals API Server               ║
║    Environment : ${process.env.NODE_ENV.padEnd(27)}║
║    Port        : ${String(PORT).padEnd(27)}║
║    URL         : http://localhost:${String(PORT).padEnd(12)}║
╚══════════════════════════════════════════════╝
    `);
});

// ── Handle unhandled promise rejections ──
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
