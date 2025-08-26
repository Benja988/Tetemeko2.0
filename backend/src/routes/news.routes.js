import express from 'express';
import { getAllNews, getFeaturedNews, getBreakingNews, searchNews, getNewsByCategory, getRecentNews, getNewsStats, getNewsById, incrementViews, createNews, updateNewsById, deleteNewsById, toggleBreakingNews } from '../controllers/news.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';
import rateLimit from 'express-rate-limit';

// Initialize router
const router = express.Router();

// Rate limiter for sensitive routes (increment views, admin actions)
const sensitiveRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 requests per window
  message: { message: 'Too many requests, please try again later' }
});

// Middleware to validate news ID parameter
const validateNewsId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: 'Invalid news ID' });
  }
  next();
};

// Middleware to validate category parameter
const validateCategory = (req, res, next) => {
  const { category } = req.params;
  if (!category || !/^[a-zA-Z0-9-]+$/.test(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  req.params.category = sanitize(category, { allowedTags: [] });
  next();
};

// Middleware to log route access
const logRouteAccess = (req, res, next) => {
  logger.info({
    message: `Accessing news route: ${req.method} ${req.originalUrl}`,
    userId: req.user?.id,
    params: req.params,
    query: req.query
  });
  next();
};

/**
 * @description Public routes for news access
 * @route /api/news
 */
router.get('/', logRouteAccess, (req, res, next) => {
  req.query.sortBy = req.query.sortBy ? sanitize(req.query.sortBy, { allowedTags: [] }) : undefined;
  req.query.sortOrder = req.query.sortOrder ? sanitize(req.query.sortOrder, { allowedTags: [] }) : undefined;
  getAllNews(req, res, next);
}); // Get all news articles
router.get('/featured', logRouteAccess, getFeaturedNews); // Get featured news
router.get('/breaking', logRouteAccess, getBreakingNews); // Get breaking news
router.get('/search', logRouteAccess, (req, res, next) => {
  req.query.q = req.query.q ? sanitize(req.query.q, { allowedTags: [] }) : undefined;
  searchNews(req, res, next);
}); // Search news by query
router.get('/category/:category', logRouteAccess, validateCategory, getNewsByCategory); // Get news by category
router.get('/recent', logRouteAccess, getRecentNews); // Get recent news
router.get('/stats', authenticateJWT, logRouteAccess, getNewsStats); // Get news statistics
router.get('/:id', logRouteAccess, validateNewsId, getNewsById); // Get news by ID
router.post('/:id/views', logRouteAccess, validateNewsId, sensitiveRouteLimiter, incrementViews); // Increment views for a news article

/**
 * @description Protected routes for admin actions
 * @route /api/news/admin
 * @access Admin
 */
const adminRouter = express.Router();
adminRouter.use(authenticateJWT, authorize([UserRole.ADMIN]), logRouteAccess);
adminRouter.post('/', (req, res, next) => {
  req.body.title = req.body.title ? sanitize(req.body.title, { allowedTags: [] }) : undefined;
  req.body.content = req.body.content ? sanitize(req.body.content, { allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a'] }) : undefined;
  req.body.category = req.body.category ? sanitize(req.body.category, { allowedTags: [] }) : undefined;
  createNews(req, res, next);
}); // Create a new news article
adminRouter.put('/:id', validateNewsId, (req, res, next) => {
  req.body.title = req.body.title ? sanitize(req.body.title, { allowedTags: [] }) : undefined;
  req.body.content = req.body.content ? sanitize(req.body.content, { allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a'] }) : undefined;
  req.body.category = req.body.category ? sanitize(req.body.category, { allowedTags: [] }) : undefined;
  updateNewsById(req, res, next);
}); // Update a news article by ID
adminRouter.delete('/:id', validateNewsId, sensitiveRouteLimiter, deleteNewsById); // Delete a news article by ID
adminRouter.patch('/:id/toggle-breaking', validateNewsId, sensitiveRouteLimiter, toggleBreakingNews); // Toggle breaking news status

router.use('/admin', adminRouter); // Mount admin routes under /admin prefix

export default router;