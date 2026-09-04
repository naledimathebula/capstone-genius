/**
 * server.js – Express application entry point
 *
 * Middleware stack (in order):
 *   1. helmet       – sets secure HTTP response headers
 *   2. rate-limiter – caps requests per IP to prevent brute-force / DoS
 *   3. cors         – allow requests from the frontend and admin dashboard origins
 *   4. body parsers – JSON and URL-encoded payloads
 *   5. /uploads     – static file serving for uploaded images (optional feature)
 *
 * API routes:
 *   /api/accommodations
 *   /api/reservations
 *   /api/users
 */

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');

const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/db');

const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes   = require('./routes/reservationRoutes');
const userRoutes          = require('./routes/userRoutes');

const app = express();

// ── Database connection ───────────────────────────────────────
connectDB();

// ── Security: HTTP headers ────────────────────────────────────
app.use(helmet());

// ── Security: rate-limit all routes (300 req / 15 min per IP) ─
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Security: stricter rate-limit on auth endpoints ───────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again in 15 minutes.' },
});

// ── CORS ──────────────────────────────────────────────────────
// CLIENT_URL and ADMIN_URL are set as environment variables on the
// deployment platform (Render). In development they fall back to localhost.
// We also allow all origins in development when neither var is set, so
// that local testing still works without touching this file.
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  // Local dev fallbacks
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads folder (optional image-upload feature) ─────
app.use('/uploads', express.static('uploads'));

// ── API routes ────────────────────────────────────────────────
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations',   reservationRoutes);
app.use('/api/users', authLimiter, userRoutes); // stricter limiter on auth

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Airbnb Clone API is running' });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
