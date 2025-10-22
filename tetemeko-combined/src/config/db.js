import { config } from 'dotenv';
config(); // ✅ Load env vars here so MONGO_URI is always set

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Custom error class for database connection errors
class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Configuration constants
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'tetemeko';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 30000; // 30 seconds

// Debug log to confirm URI
console.log('DEBUG MONGO_URI:', MONGO_URI);

// Validate environment variables
if (!MONGO_URI) {
  throw new DatabaseError('MONGO_URI is not defined in the environment variables');
}

/**
 * Connect to MongoDB with retry logic and event listeners
 */
export const connectDB = async () => {
  let attempts = 0;

  const connectionOptions = {
    dbName: DB_NAME,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
    connectTimeoutMS: CONNECTION_TIMEOUT,
    socketTimeoutMS: CONNECTION_TIMEOUT,
    autoIndex: process.env.NODE_ENV !== 'production',
    retryWrites: true,
    w: 'majority'
  };

  // Connection event listeners
  mongoose.connection.on('connected', () => {
    logger.info({
      message: 'MongoDB connected successfully',
      dbName: DB_NAME,
      uri: MONGO_URI.replace(/\/\/.*@/, '//[credentials]@')
    });
  });

  mongoose.connection.on('error', (error) => {
    logger.error({
      message: 'MongoDB connection error',
      error: error.message,
      stack: error.stack
    });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn({
      message: 'MongoDB disconnected',
      dbName: DB_NAME
    });
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info({ message: 'MongoDB connection closed due to application termination' });
    process.exit(0);
  });

  // Retry logic
  while (attempts < RETRY_ATTEMPTS) {
    try {
      attempts++;
      await mongoose.connect(MONGO_URI, connectionOptions);
      return;
    } catch (error) {
      logger.error({
        message: `MongoDB connection attempt ${attempts} failed`,
        error: error.message,
        attempt: attempts,
        maxAttempts: RETRY_ATTEMPTS
      });

      if (attempts === RETRY_ATTEMPTS) {
        throw new DatabaseError(`Failed to connect to MongoDB after ${RETRY_ATTEMPTS} attempts: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info({ message: 'MongoDB connection closed gracefully' });
  } catch (error) {
    logger.error({
      message: 'Error closing MongoDB connection',
      error: error.message
    });
    throw new DatabaseError(`Failed to close MongoDB connection: ${error.message}`);
  }
};
