import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import queryRoutes from './routes/query.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';

const app = express();

// CORS configuration supporting cookies credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is healthy.' });
});

// API Routes
app.use('/api', queryRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
