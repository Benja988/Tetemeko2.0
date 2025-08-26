import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import logger from './utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import authorRoutes from './routes/author.routes.js';
import newsRoutes from './routes/news.routes.js';
import categoryRoutes from './routes/category.routes.js';
import episodeRoutes from './routes/episode.routes.js';
import stationRoutes from './routes/station.routes.js';
import podcastRoutes from './routes/podcast.routes.js';
/*import productRoutes from './routes/product.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
*/

// Load environment variables
config();

// Configuration object
const APP_CONFIG = {
  frontendUrls: process.env.FRONTEND_URLS?.split(',') || ['http://localhost:3000'],
  apiVersion: process.env.API_VERSION || 'v1',
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || 100
  },
  maxBodySize: process.env.MAX_BODY_SIZE || '10mb',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Initialize Express app
const app = express();

// Request ID middleware
app.use((req, res, next) => {
  const correlationId = uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    correlationId,
    ip: req.ip
  });
  next();
});

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || APP_CONFIG.frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
  exposedHeaders: ['X-Correlation-ID']
}));

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", ...APP_CONFIG.frontendUrls]
    }
  },
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true
}));

// Compression for better performance
app.use(compression());

// Body parsers
app.use(express.json({ limit: APP_CONFIG.maxBodySize }));
app.use(express.urlencoded({ extended: true, limit: APP_CONFIG.maxBodySize }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: APP_CONFIG.rateLimit.windowMs,
  max: APP_CONFIG.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// API routes with versioning
const apiBase = `/api/${APP_CONFIG.apiVersion}`;
app.use(`${apiBase}/auth`, authRoutes);
app.use(`${apiBase}/users`, userRoutes);
app.use(`${apiBase}/authors`, authorRoutes);
app.use(`${apiBase}/news`, newsRoutes);
app.use(`${apiBase}/categories`, categoryRoutes);
app.use(`${apiBase}/podcasts`, episodeRoutes);
app.use(`${apiBase}/stations`, stationRoutes);
app.use(`${apiBase}/podcasts`, podcastRoutes);
/*app.use(`${apiBase}/products`, productRoutes);

app.use(`${apiBase}/schedules`, scheduleRoutes);


*/

// Health check endpoint
app.get('/health', (req, res) => {
  const status = {
    status: 'healthy',
    environment: APP_CONFIG.nodeEnv,
    apiVersion: APP_CONFIG.apiVersion,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
  logger.info('Health check requested', { correlationId: req.correlationId, status });
  res.status(200).json(status);
});

// Default route
app.get('/', (req, res) => {
  logger.info('Default route accessed', { correlationId: req.correlationId });
  res.status(200).send('Tetemeko Media Group API is running...');
});

// Global error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    correlationId: req.correlationId
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: APP_CONFIG.nodeEnv === 'production' ? 'Internal Server Error' : err.message,
    correlationId: req.correlationId,
    ...(APP_CONFIG.nodeEnv !== 'production' && { stack: err.stack })
  });
});

// Initialize app logging
logger.info('Application initialized', {
  environment: APP_CONFIG.nodeEnv,
  apiVersion: APP_CONFIG.apiVersion,
  frontendUrls: APP_CONFIG.frontendUrls
});

export default app;