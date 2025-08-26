import express from 'express';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

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
const validateSlug = (req, res, next) => {
  const slug = sanitize(req.params.slug, { allowedTags: [] });
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
    logger.error('Invalid category slug', { slug, correlationId: req.correlationId });
    return res.status(400).json({ message: 'Invalid category slug', correlationId: req.correlationId });
  }
  req.params.slug = slug;
  next();
};

const validateCategoryData = (req, res, next) => {
  const { name, description } = req.body;
  if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Name must be 2-100 characters', correlationId: req.correlationId });
  }
  if (description && (typeof description !== 'string' || description.length > 500)) {
    return res.status(400).json({ message: 'Description cannot exceed 500 characters', correlationId: req.correlationId });
  }
  req.body = {
    ...req.body,
    name: sanitize(name, { allowedTags: [] }),
    description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : undefined
  };
  next();
};

const validateListQuery = (req, res, next) => {
  const { page, limit } = req.query;
  if (page && !/^\d+$/.test(page)) {
    return res.status(400).json({ message: 'Page must be a positive integer', correlationId: req.correlationId });
  }
  if (limit && !/^\d+$/.test(limit)) {
    return res.status(400).json({ message: 'Limit must be a positive integer', correlationId: req.correlationId });
  }
  req.query = {
    ...req.query,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  };
  next();
};

/**
 * @route GET /api/v1/categories
 * @desc Get all categories
 * @access Public
 */
router.get('/', publicRateLimiter, validateListQuery, async (req, res, next) => {
  try {
    await getAllCategories(req, res);
    logger.info('Retrieved all categories', { query: req.query, correlationId: req.correlationId });
  } catch (error) {
    logger.error('Error retrieving categories', {
      error: error.message,
      stack: error.stack,
      query: req.query,
      correlationId: req.correlationId
    });
    next(error);
  }
});

/**
 * @route GET /api/v1/categories/:slug
 * @desc Get category by slug
 * @access Public
 */
router.get('/:slug', publicRateLimiter, validateSlug, async (req, res, next) => {
  try {
    await getCategoryBySlug(req, res);
    logger.info('Retrieved category by slug', { slug: req.params.slug, correlationId: req.correlationId });
  } catch (error) {
    logger.error('Error retrieving category by slug', {
      error: error.message,
      stack: error.stack,
      slug: req.params.slug,
      correlationId: req.correlationId
    });
    next(error);
  }
});

/**
 * @route POST /api/v1/categories
 * @desc Create a new category
 * @access Admin
 */
router.post(
  '/',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateCategoryData,
  async (req, res, next) => {
    try {
      req.body.createdBy = req.user.id;
      await createCategory(req, res);
      logger.audit('Category created', {
        userId: req.user.id,
        body: req.body,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error creating category', {
        error: error.message,
        stack: error.stack,
        userId: req.user.id,
        body: req.body,
        correlationId: req.correlationId
      });
      next(error);
    }
  }
);

/**
 * @route GET /api/v1/categories/:id
 * @desc Get category by id
 * @access Public
 */
router.get('/:id', publicRateLimiter, async (req, res, next) => {
  try {
    await getCategoryById(req, res);
    logger.info('Retrieved category by id', { id: req.params.id, correlationId: req.correlationId });
  } catch (error) {
    logger.error('Error retrieving category by id', {
      error: error.message,
      stack: error.stack,
      id: req.params.id,
      correlationId: req.correlationId
    });
    next(error);
  }
});

/**
 * @route PUT /api/v1/categories/:id
 * @desc Update a category
 * @access Admin
 */
router.put(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  validateCategoryData,
  async (req, res, next) => {
    try {
      req.body.updatedBy = req.user.id;
      await updateCategory(req, res);
      logger.audit('Category updated', {
        userId: req.user.id,
        id: req.params.id,
        body: req.body,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error updating category', {
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
 * @route DELETE /api/v1/categories/:id
 * @desc Soft delete a category
 * @access Admin
 */
router.delete(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  async (req, res, next) => {
    try {
      req.body.deletedBy = req.user.id;
      await deleteCategory(req, res);
      logger.audit('Category soft deleted', {
        userId: req.user.id,
        id: req.params.id,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Error soft deleting category', {
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


export default router;