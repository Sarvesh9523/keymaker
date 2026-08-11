import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import queryRoutes from './routes/query.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';

const app = express();

// Allowed Frontend Origins (Development: http://localhost:5173, Production: https://keymaker-seven.vercel.app)
const allowedOrigins = [
  'http://localhost:5173',
  'https://keymaker-seven.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((url) => url.trim()) : []),
].map((url) => url.replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or non-browser requests (e.g. Postman, Curl)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      return callback(null, origin);
    },
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
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
