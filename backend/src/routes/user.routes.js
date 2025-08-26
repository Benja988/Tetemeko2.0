import express from 'express';
import { getUsers, searchUsers, getUserById, updateUser, deleteUser, deleteUsers, lockUser, unlockUser, adminResetPassword, reactivateUser, promoteToManager } from '../controllers/user.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';
import rateLimit from 'express-rate-limit';

// Initialize router
const router = express.Router();

// Rate limiter for sensitive routes (lock, unlock, reset-password, reactivate, promote)
const sensitiveRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 requests per window
  message: { message: 'Too many requests, please try again later' }
});

// Middleware to validate userId parameter
const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  next();
};

// Middleware to log route access
const logRouteAccess = (req, res, next) => {
  logger.info({
    message: `Accessing user route: ${req.method} ${req.originalUrl}`,
    userId: req.user?.id,
    params: req.params,
    query: req.query
  });
  next();
};

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT, authorize([UserRole.ADMIN]), logRouteAccess);

/**
 * @route GET /api/users
 * @desc Get paginated users with optional filtering and sorting
 * @access Admin
 */
router.get('/', (req, res, next) => {
  req.query.role = req.query.role ? sanitize(req.query.role, { allowedTags: [] }) : undefined;
  req.query.sortBy = req.query.sortBy ? sanitize(req.query.sortBy, { allowedTags: [] }) : undefined;
  req.query.sortOrder = req.query.sortOrder ? sanitize(req.query.sortOrder, { allowedTags: [] }) : undefined;
  getUsers(req, res, next);
});

/**
 * @route GET /api/users/search
 * @desc Search users by name or email
 * @access Admin
 */
router.get('/search', (req, res, next) => {
  req.query.q = req.query.q ? sanitize(req.query.q, { allowedTags: [] }) : undefined;
  searchUsers(req, res, next);
});

/**
 * @route GET /api/users/:userId
 * @desc Get user details by ID
 * @access Admin
 */
router.get('/:userId', validateUserId, getUserById);

/**
 * @route PUT /api/users/:userId
 * @desc Update user details (name, email, role, isActive)
 * @access Admin
 */
router.put('/:userId', validateUserId, (req, res, next) => {
  req.body.name = req.body.name ? sanitize(req.body.name, { allowedTags: [] }) : undefined;
  req.body.email = req.body.email ? sanitize(req.body.email, { allowedTags: [] }) : undefined;
  req.body.role = req.body.role ? sanitize(req.body.role, { allowedTags: [] }) : undefined;
  updateUser(req, res, next);
});

/**
 * @route DELETE /api/users/:userId
 * @desc Soft delete (deactivate) user by ID
 * @access Admin
 */
router.delete('/:userId', validateUserId, sensitiveRouteLimiter, deleteUser);

/**
 * @route DELETE /api/users
 * @desc Soft delete multiple users
 * @access Admin
 */
router.delete('/', sensitiveRouteLimiter, (req, res, next) => {
  req.body.userIds = req.body.userIds ? req.body.userIds.map(id => sanitize(id, { allowedTags: [] })) : undefined;
  deleteUsers(req, res, next);
});

/**
 * @route POST /api/users/:userId/lock
 * @desc Lock user account
 * @access Admin
 */
router.post('/:userId/lock', validateUserId, sensitiveRouteLimiter, lockUser);

/**
 * @route POST /api/users/:userId/unlock
 * @desc Unlock user account
 * @access Admin
 */
router.post('/:userId/unlock', validateUserId, sensitiveRouteLimiter, unlockUser);

/**
 * @route POST /api/users/:userId/reset-password
 * @desc Admin password reset (generate reset token)
 * @access Admin
 */
router.post('/:userId/reset-password', validateUserId, sensitiveRouteLimiter, adminResetPassword);

/**
 * @route POST /api/users/:userId/reactivate
 * @desc Reactivate a deactivated user account
 * @access Admin
 */
router.post('/:userId/reactivate', validateUserId, sensitiveRouteLimiter, reactivateUser);

/**
 * @route POST /api/users/:userId/promote
 * @desc Promote user to Manager role
 * @access Admin
 */
router.post('/:userId/promote', validateUserId, sensitiveRouteLimiter, promoteToManager);

export default router;