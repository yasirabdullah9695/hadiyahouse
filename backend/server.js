require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// ─── Process Level Crash-Proof Guards ─────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error(`⚠️ [CRASH PREVENTED] Uncaught Exception: ${err.message}`, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [CRASH PREVENTED] Unhandled Rejection at:', promise, 'reason:', reason);
});

// ─── Database Connect ────────────────────────────────────────────────────────
connectDB();

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();

// Enable trust proxy for reverse proxies like NGINX / Cloudflare
app.set('trust proxy', 1);

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows serving uploaded images cross-origin
    contentSecurityPolicy: false, // Prevents blocking React inline styles/scripts
  })
);

// ─── Response Compression (Gzip) ──────────────────────────────────────────────
app.use(compression());

// ─── Rate Limiting & Anti-DDoS Protection ────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 1000 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bohat zyada requests aaye hain. Kripya thodi der baad try karein.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bohat zyada login attempts. Security ke liye 15 min wait karein.',
  },
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);

// ─── CORS Setup ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Built-in Body Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Static Files & Image Caching ────────────────────────────────────────────
// High performance 30-day immutable caching for static uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'), {
    maxAge: '30d',
    immutable: true,
  })
);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hadiya House High-Performance Backend Live & Ready! 🚀',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route nahi mili: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Hadiya House High-Scalability Backend active!`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛡️ Rate Limiter, Helmet Security, Gzip Compression & Crash Guards Active.\n`);
});

module.exports = app;
