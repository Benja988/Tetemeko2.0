import { createServer } from 'http';
import { readFileSync } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { config } from 'dotenv';
import app from './app.mjs';
import { connectDB as dbConnect } from './config/db.js';
import logger from './utils/logger.js';

// Load environment variables
config();


const SERVER_CONFIG = {
  port: Number(process.env.PORT) || 5001,
  host: process.env.HOST || 'localhost',
  useHttps: process.env.USE_HTTPS === 'true',
  maxDbRetries: Number(process.env.DB_MAX_RETRIES) || 5,
  dbRetryDelay: Number(process.env.DB_RETRY_DELAY) || 5000 // ms
};

// Validate port
if (!SERVER_CONFIG.port || SERVER_CONFIG.port < 1024 || SERVER_CONFIG.port > 65535) {
  logger.error('Invalid port configuration', { port: SERVER_CONFIG.port });
  throw new Error('Invalid port number');
}

let server;
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down...`);
  try {
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    }
    setTimeout(() => {
      logger.warn('Force shutting down');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Retry DB connect
const connectWithRetry = async (retries = SERVER_CONFIG.maxDbRetries) => {
  let attempt = 1;
  while (attempt <= retries) {
    try {
      logger.debug(`DB connection attempt ${attempt} of ${retries}`);
      await dbConnect();
      logger.info('✅ Database connected successfully');
      return;
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, error);
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, SERVER_CONFIG.dbRetryDelay));
      attempt++;
    }
  }
};

const createAppServer = () => {
  if (SERVER_CONFIG.useHttps) {
    const key = process.env.HTTPS_KEY_PATH ? readFileSync(process.env.HTTPS_KEY_PATH) : null;
    const cert = process.env.HTTPS_CERT_PATH ? readFileSync(process.env.HTTPS_CERT_PATH) : null;
    if (!key || !cert) throw new Error('Missing HTTPS key or certificate');
    return createHttpsServer({ key, cert }, app);
  }
  return createServer(app);
};

(async () => {
  try {
    logger.debug('Starting DB connection...');
    await connectWithRetry();

    logger.debug('Creating server...');
    server = createAppServer();

    logger.debug('Starting server...');
    server.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
      logger.info(`🚀 Server running at ${SERVER_CONFIG.useHttps ? 'https' : 'http'}://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });
  } catch (error) {
    console.error('🔥 Startup error:', error);
    // Commenting process.exit(1) for debugging so nodemon can restart automatically
    // process.exit(1);
  }
})();

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});
