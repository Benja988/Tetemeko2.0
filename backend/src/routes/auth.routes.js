import express from 'express';
import { 
  registerUser, 
  registerManager, 
  registerAdmin, 
  verifyEmail, 
  resendVerification, 
  login, 
  logout, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  inviteManager, 
  promoteToAdmin, 
  getProfile, 
  updateProfile, 
  deactivateAccount 
} from '../controllers/auth.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import sanitize from 'sanitize-html';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// Create router instance
const router = express.Router();

// Rate limiting configurations
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const passwordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many password-related requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateRequestBody = (schema) => {
  return (req, res, next) => {
    try {
      logger.info('Validating request body', { body: req.body });
      schema(req.body);
      next();
    } catch (error) {
      logger.error('Validation error:', { error: error.message, body: req.body });
      return res.status(400).json({ message: 'Invalid request data', errors: error.message });
    }
  };
};

// Validation schemas
const registerSchema = (body) => {
  const { email, password, name } = body;
  if (!email || typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error('Valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!name || typeof name !== 'string' || name.length < 2) {
    throw new Error('Name must be at least 2 characters');
  }
};

const loginSchema = (body) => {
  const { email, password } = body;
  if (!email || typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error('Valid email is required');
  }
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }
};

const passwordSchema = (body) => {
  const { email, newPassword } = body;
  if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error('Valid email is required');
  }
  if (newPassword && (typeof newPassword !== 'string' || newPassword.length < 8)) {
    throw new Error('New password must be at least 8 characters');
  }
};

/**
 * @route POST /register-user
 * @desc Register a new web user
 * @access Public
 */
router.post(
  '/register-user',
  authRateLimiter,
  validateRequestBody(registerSchema),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      req.body.name = sanitize(req.body.name, { allowedTags: [] });
      await registerUser(req, res);
    } catch (error) {
      logger.error('Register user error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /register-manager
 * @desc Register a new manager with invitation code
 * @access Public
 */
router.post(
  '/register-manager',
  authRateLimiter,
  validateRequestBody(registerSchema),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      req.body.name = sanitize(req.body.name, { allowedTags: [] });
      req.body.invitationCode = req.body.invitationCode ? sanitize(req.body.invitationCode, { allowedTags: [] }) : undefined;
      await registerManager(req, res);
    } catch (error) {
      logger.error('Register manager error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /register-admin
 * @desc Register a new admin (requires super admin authorization)
 * @access Admin
 */
router.post(
  '/register-admin',
  authRateLimiter,
  validateRequestBody(registerSchema),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      req.body.name = sanitize(req.body.name, { allowedTags: [] });
      await registerAdmin(req, res);
    } catch (error) {
      logger.error('Register admin error:', { error: error.message, body: req.body, userId: req.user?.id });
      next(error);
    }
  }
);

/**
 * @route GET /verify-email
 * @desc Verify user email with token
 * @access Public
 */
router.get('/verify-email', async (req, res, next) => {
  try {
    req.query.token = req.query.token ? sanitize(req.query.token, { allowedTags: [] }) : undefined;
    await verifyEmail(req, res);
  } catch (error) {
    logger.error('Verify email error:', { error: error.message, query: req.query });
    next(error);
  }
});

/**
 * @route POST /resend-verification
 * @desc Resend email verification link
 * @access Public
 */
router.post(
  '/resend-verification',
  authRateLimiter,
  validateRequestBody((body) => {
    if (!body.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(body.email)) {
      throw new Error('Valid email is required');
    }
  }),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      await resendVerification(req, res);
    } catch (error) {
      logger.error('Resend verification error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /login
 * @desc Authenticate user and return JWT
 * @access Public
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequestBody(loginSchema),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      await login(req, res);
    } catch (error) {
      logger.error('Login error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /logout
 * @desc Invalidate user session
 * @access Private
 */
router.post('/logout', authenticateJWT, async (req, res, next) => {
  try {
    await logout(req, res);
    logger.info('User logged out', { userId: req.user?.id });
  } catch (error) {
    logger.error('Logout error:', { error: error.message, userId: req.user?.id });
    next(error);
  }
});

/**
 * @route POST /refresh-token
 * @desc Refresh JWT token
 * @access Public
 */
router.post('/refresh-token', async (req, res, next) => {
  try {
    req.body.refreshToken = req.body.refreshToken ? sanitize(req.body.refreshToken, { allowedTags: [] }) : undefined;
    await refreshToken(req, res);
  } catch (error) {
    logger.error('Refresh token error:', { error: error.message, body: req.body });
    next(error);
  }
});

/**
 * @route POST /forgot-password
 * @desc Request password reset link
 * @access Public
 */
router.post(
  '/forgot-password',
  passwordRateLimiter,
  validateRequestBody(passwordSchema),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      await forgotPassword(req, res);
    } catch (error) {
      logger.error('Forgot password error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post(
  '/reset-password',
  passwordRateLimiter,
  validateRequestBody(passwordSchema),
  async (req, res, next) => {
    try {
      req.query.token = sanitize(req.query.token, { allowedTags: [] });
      req.body.newPassword = sanitize(req.body.newPassword, { allowedTags: [] });
      await resetPassword(req, res);
    } catch (error) {
      logger.error('Reset password error:', { error: error.message, body: req.body });
      next(error);
    }
  }
);

/**
 * @route POST /invite-manager
 * @desc Invite a new manager (admin only)
 * @access Admin
 */
router.post(
  '/invite-manager',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  async (req, res, next) => {
    try {
      req.body.email = sanitize(req.body.email, { allowedTags: [] });
      await inviteManager(req, res);
      logger.info('Manager invited', { userId: req.user?.id, invitedEmail: req.body.email });
    } catch (error) {
      logger.error('Invite manager error:', { error: error.message, body: req.body, userId: req.user?.id });
      next(error);
    }
  }
);

/**
 * @route PUT /promote/:userId
 * @desc Promote a user to admin (admin only)
 * @access Admin
 */
router.put(
  '/promote/:userId',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  async (req, res, next) => {
    try {
      req.params.userId = sanitize(req.params.userId, { allowedTags: [] });
      await promoteToAdmin(req, res);
      logger.info('User promoted to admin', { userId: req.user?.id, promotedUserId: req.params.userId });
    } catch (error) {
      logger.error('Promote to admin error:', { error: error.message, userId: req.user?.id, promotedUserId: req.params.userId });
      next(error);
    }
  }
);

/**
 * @route GET /profile
 * @desc Get authenticated user's profile
 * @access Private
 */
router.get('/profile', authenticateJWT, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (error) {
    logger.error('Get profile error:', { error: error.message, userId: req.user?.id });
    next(error);
  }
});

/**
 * @route PUT /profile
 * @desc Update authenticated user's profile
 * @access Private
 */
router.put(
  '/profile',
  authenticateJWT,
  validateRequestBody((body) => {
    if (body.name && (typeof body.name !== 'string' || body.name.length < 2)) {
      throw new Error('Name must be at least 2 characters');
    }
    if (body.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(body.email)) {
      throw new Error('Valid email is required');
    }
  }),
  async (req, res, next) => {
    try {
      req.body.name = req.body.name ? sanitize(req.body.name, { allowedTags: [] }) : undefined;
      req.body.email = req.body.email ? sanitize(req.body.email, { allowedTags: [] }) : undefined;
      await updateProfile(req, res);
      logger.info('Profile updated', { userId: req.user?.id });
    } catch (error) {
      logger.error('Update profile error:', { error: error.message, userId: req.user?.id, body: req.body });
      next(error);
    }
  }
);

/**
 * @route DELETE /deactivate
 * @desc Deactivate authenticated user's account (soft delete)
 * @access Private
 */
router.delete('/deactivate', authenticateJWT, async (req, res, next) => {
  try {
    await deactivateAccount(req, res);
    logger.info('Account deactivated', { userId: req.user?.id });
  } catch (error) {
    logger.error('Deactivate account error:', { error: error.message, userId: req.user?.id });
    next(error);
  }
});

export default router;