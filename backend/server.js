import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

// Setup env and db
dotenv.config();
connectDB();

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:", "blob:"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "connect-src": ["'self'", "https:", "http:", "ws:", "wss:"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "font-src": ["'self'", "https:", "data:"]
    }
  }
}));
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://localhost:5173', // Added HTTPS for local development
  'http://localhost:5174',
  'https://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in development mode for easier tunnel testing
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    
    // In production, strictly check allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: origin ${origin} is not in allowedOrigins: ${allowedOrigins}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

import routes from './routes/index.js';

// Health Check for Proxy Verification
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'AuraAI Backend Operational', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── UNIFIED ROUTING (CRITICAL FIX) ──────────────────────
const distPath = path.join(__dirname, '../frontend/dist');

// 1. Static Assets (Must be FIRST)
app.use(express.static(distPath, { index: false }));

// 2. API Routes
app.use('/api', routes);

// 3. SPA Fallback
app.get('*', (req, res) => {
  // Only serve index.html for non-API, GET requests
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'API Route Not Found' });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
