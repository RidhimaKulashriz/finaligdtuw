import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import env from './config/env';
import { connectDB } from './config/database';
import { apiLimiter, authLimiter, scanLimiter } from './config/rateLimiter';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import urlRoutes from './routes/url.routes';
import communityRoutes from './routes/community.routes';
import dashboardRoutes from './routes/dashboard.routes';
import resourceRoutes from './routes/resource.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

// Load environment variables
config();

// Create Express application
const app: Application = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
app.use(apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Routes
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Health check endpoint
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Apply specific rate limiters to sensitive routes
app.use(`${API_PREFIX}/auth`, authLimiter);
app.use(`${API_PREFIX}/messages/scan`, scanLimiter);
app.use(`${API_PREFIX}/urls/scan`, scanLimiter);

// API Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/messages`, messageRoutes);
app.use(`${API_PREFIX}/urls`, urlRoutes);
app.use(`${API_PREFIX}/community`, communityRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/resources`, resourceRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}${API_PREFIX}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;
