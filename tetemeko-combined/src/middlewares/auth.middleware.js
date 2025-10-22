// src/middlewares/auth.middleware.js

import jwt from 'jsonwebtoken';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';
import User, { UserRole } from '../models/User.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Configuration
export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  refreshSecret: process.env.REFRESH_SECRET || 'default-refresh-secret',
  tokenIssuer: process.env.JWT_ISSUER || 'tetemeko-media',
  allowedAlgorithms: ['HS256']
};

// Custom error classes
class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

class TokenBlacklistedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenBlacklistedError';
    this.status = 401;
  }
}

// In-memory token blacklist (replace with Redis in production)
const tokenBlacklist = new Set();

/**
 * Validate and sanitize authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string} Sanitized token
 */
const validateAuthHeader = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') {
    throw new AuthError('No token provided', 401);
  }
  const sanitizedHeader = sanitize(authHeader, { allowedTags: [] });
  if (!sanitizedHeader.startsWith('Bearer ')) {
    throw new AuthError('Invalid token format', 401);
  }
  return sanitizedHeader.split(' ')[1];
};

/**
 * JWT Authentication Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = validateAuthHeader(authHeader);

    // Log token payload for debugging
    const decodedPayload = jwt.decode(token, { complete: true });
    logger.info('Token payload', {
      payload: decodedPayload?.payload,
      correlationId: req.correlationId
    });

    // Check token blacklist
    if (tokenBlacklist.has(token)) {
      throw new TokenBlacklistedError('Token has been blacklisted');
    }

    // Verify token
    const decoded = jwt.verify(token, AUTH_CONFIG.jwtSecret, {
      algorithms: AUTH_CONFIG.allowedAlgorithms,
      issuer: AUTH_CONFIG.tokenIssuer
    });

    // Fetch user and verify status
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AuthError('User not found', 401);
    }
    if (!user.isActive) {
      throw new AuthError('Account is inactive or suspended', 403);
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      correlationId: req.correlationId
    };

    logger.info('User authenticated', {
      userId: decoded.id,
      role: decoded.role,
      correlationId: req.correlationId
    });

    next();
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack,
      correlationId: req.correlationId
    });

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired', correlationId: req.correlationId });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Forbidden: Invalid token', correlationId: req.correlationId });
    }
    return res.status(error.status || 401).json({ message: error.message, correlationId: req.correlationId });
  }
};

/**
 * Role-Based Authorization Middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware
 */
export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthError('No user in request', 401);
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        throw new AuthError('User not found', 401);
      }
      if (!allowedRoles.includes(user.role)) {
        throw new AuthError('Access denied: Insufficient role permissions', 403);
      }

      logger.info('User authorized', {
        userId: req.user.id,
        role: user.role,
        allowedRoles,
        correlationId: req.correlationId
      });

      next();
    } catch (error) {
      logger.error('Authorization error', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        allowedRoles,
        correlationId: req.correlationId
      });
      return res.status(error.status || 403).json({ message: error.message, correlationId: req.correlationId });
    }
  };
};

/**
 * Super Admin Authorization Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authorizeSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthError('No user in request', 401);
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new AuthError('Forbidden: Only admins allowed', 403);
    }

    logger.info('Super admin authorized', {
      userId: req.user.id,
      role: user.role,
      correlationId: req.correlationId
    });

    next();
  } catch (error) {
    logger.error('Super admin authorization error', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      correlationId: req.correlationId
    });
    return res.status(error.status || 403).json({ message: error.message, correlationId: req.correlationId });
  }
};

/**
 * Add token to blacklist (e.g., for logout)
 * @param {string} token - JWT token to blacklist
 */
export const blacklistToken = (token) => {
  tokenBlacklist.add(sanitize(token, { allowedTags: [] }));
  logger.info('Token blacklisted', { token: '[sanitized]' });
};

/**
 * Validate refresh token
 * @param {string} token - Refresh token
 * @returns {Object} Decoded token payload
 */
export const validateRefreshToken = (token) => {
  try {
    const sanitizedToken = sanitize(token, { allowedTags: [] });
    if (tokenBlacklist.has(sanitizedToken)) {
      throw new TokenBlacklistedError('Refresh token has been blacklisted');
    }

    const decoded = jwt.verify(sanitizedToken, AUTH_CONFIG.refreshSecret, {
      algorithms: AUTH_CONFIG.allowedAlgorithms,
      issuer: AUTH_CONFIG.tokenIssuer
    });

    logger.info('Refresh token validated', {
      userId: decoded.id,
      correlationId: decoded.correlationId
    });

    return decoded;
  } catch (error) {
    logger.error('Refresh token validation error', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Initialize middleware logging
logger.info('Authentication middleware initialized', {
  jwtIssuer: AUTH_CONFIG.tokenIssuer,
  allowedAlgorithms: AUTH_CONFIG.allowedAlgorithms
});