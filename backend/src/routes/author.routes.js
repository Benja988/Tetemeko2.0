import express from 'express';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  verifyAuthor,
  searchAuthors
} from '../controllers/author.controller.js';

// Initialize router
const router = express.Router();

// Rate limiting for public routes
const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateId = (req, res, next) => {
  const id = sanitize(req.params.id, { allowedTags: [] });
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    logger.error('Invalid author ID', { id, correlationId: req.correlationId });
    return res.status(400).json({ message: 'Invalid author ID', correlationId: req.correlationId });
  }
  req.params.id = id;
  next();
};

const validateCreateAuthor = (req, res, next) => {
  const { name, email, bio } = req.body;
  if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Name must be 2-100 characters', correlationId: req.correlationId });
  }
  if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format', correlationId: req.correlationId });
  }
  if (bio && (typeof bio !== 'string' || bio.length > 500)) {
    return res.status(400).json({ message: 'Bio cannot exceed 500 characters', correlationId: req.correlationId });
  }
  req.body = {
    ...req.body,
    name: sanitize(name, { allowedTags: [] }),
    email: email ? sanitize(email, { allowedTags: [] }) : undefined,
    bio: bio ? sanitize(bio, { allowedTags: ['p', 'strong', 'em'] }) : undefined
  };
  next();
};

const validateSearchQuery = (req, res, next) => {
  const { q, page, limit } = req.query;
  if (q && (typeof q !== 'string' || q.length > 100)) {
    return res.status(400).json({ message: 'Search query must be a string under 100 characters', correlationId: req.correlationId });
  }
  if (page && !/^\d+$/.test(page)) {
    return res.status(400).json({ message: 'Page must be a positive integer', correlationId: req.correlationId });
  }
  if (limit && !/^\d+$/.test(limit)) {
    return res.status(400).json({ message: 'Limit must be a positive integer', correlationId: req.correlationId });
  }
  req.query = {
    q: q ? sanitize(q, { allowedTags: [] }) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  };
  next();
};

/**
 * @route GET /api/v1/authors
 * @desc Get all authors
 * @access Public
 */
router.get('/', publicRateLimiter, async (req, res, next) => {
  try {
    await getAllAuthors(req, res);
    logger.info('Retrieved all authors', { correlationId: req.correlationId });
  } catch (error) {
    logger.error('Error retrieving authors', {
      error: error.message,
      stack: error.stack,
      correlationId: req.correlationId
    });
    next(error);
  }
});

/**
 * @route GET /api/v1/authors/:id
 * @desc Get author by ID
 * @access Public
 */
router.get('/:id', publicRateLimiter, validateId, async (req, res, next) => {
  try {
    await getAuthorById(req, res);
    logger.info('Retrieved author by ID', { id: req.params.id, correlationId: req.correlationId });
  } catch (error) {
    logger.error('Error retrieving author by ID', {
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      correlationId: req.correlationId
    });
    next(error);
  }
});

/**
 * @route POST /api/v1/authors
 * @desc Create a new author
 * @access Admin
 */
router.post(
  '/',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateCreateAuthor,
  async (req, res, next) => {
    try {
      req.body.createdBy = req.user.id;
      await createAuthor(req, res);
      logger.audit('Author created', {
        userId: req.user.id,
        body: req.body,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error creating author', {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
        correlationId: req.correlationId
      });
      next(error);
    }
  }
);

/**
 * @route PATCH /api/v1/authors/:id
 * @desc Update an author
 * @access Admin
 */
router.patch(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateId,
  validateCreateAuthor,
  async (req, res, next) => {
    try {
      req.body.updatedBy = req.user.id;
      await updateAuthor(req, res);
      logger.audit('Author updated', {
        userId: req.user.id,
        id: req.params.id,
        body: req.body,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error updating author', {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
      next(error);
    }
  }
);

/**
 * @route DELETE /api/v1/authors/:id
 * @desc Soft delete an author
 * @access Admin
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateId,
  async (req, res, next) => {
    try {
      req.body.deletedBy = req.user.id;
      await deleteAuthor(req, res);
      logger.audit('Author soft deleted', {
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error soft deleting author', {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
      next(error);
    }
  }
);

/**
 * @route PATCH /api/v1/authors/:id/verify
 * @desc Verify an author
 * @access Admin
 */
router.patch(
  '/:id/verify',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateId,
  async (req, res, next) => {
    try {
      req.body.updatedBy = req.user.id;
      await verifyAuthor(req, res);
      logger.audit('Author verified', {
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error verifying author', {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
      next(error);
    }
  }
);

/**
 * @route GET /api/v1/authors/search
 * @desc Search authors by query
 * @access Public
 */
router.get('/search', publicRateLimiter, validateSearchQuery, async (req, res, next) => {
  try {
    await searchAuthors(req, res);
    logger.info('Author search performed', {
      query: req.query,
      correlationId: req.correlationId
    });
  } catch (error) {
    logger.error('Error searching authors', {
      error: error.message,
      stack: error.stack,
      query: req.query,
      correlationId: req.correlationId
    });
    next(error);
  }
});

export default router;