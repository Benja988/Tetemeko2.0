import mongoose from 'mongoose';
import { Payment, PaymentStatus, PaymentMethod } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { User, UserRole } from '../models/User.js';
import { sanitize } from 'sanitize-html';
import logger from '../utils/logger.js';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Predefined valid values
const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];
const VALID_METHODS = Object.values(PaymentMethod);
const VALID_STATUSES = Object.values(PaymentStatus);
const ITEMS_PER_PAGE = 20;

// Check permissions for admin or manager actions
const checkAdminPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate payment fields
const validatePaymentFields = ({ order, amount, method, transactionId, currency, status }) => {
  if (!order || !mongoose.isValidObjectId(order)) {
    throw new APIError('Valid order ID is required', 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new APIError('Amount must be a positive number', 400);
  }
  if (method && !VALID_METHODS.includes(method)) {
    throw new APIError(`Invalid payment method. Must be one of: ${VALID_METHODS.join(', ')}`, 400);
  }
  if (transactionId && typeof transactionId !== 'string') {
    throw new APIError('Transaction ID must be a string', 400);
  }
  if (currency && !VALID_CURRENCIES.includes(currency)) {
    throw new APIError(`Invalid currency. Must be one of: ${VALID_CURRENCIES.join(', ')}`, 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new APIError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }
};

/**
 * Create a new payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPayment = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { order, amount, method, transactionId, currency = 'USD', providerResponse } = req.body;

    validatePaymentFields({ order, amount, method, transactionId, currency });

    const sanitizedData = {
      order: sanitize(order, { allowedTags: [] }),
      user: req.user.id,
      amount,
      method: method ? sanitize(method, { allowedTags: [] }) : undefined,
      transactionId: transactionId ? sanitize(transactionId, { allowedTags: [] }) : undefined,
      currency: sanitize(currency, { allowedTags: [] }),
      providerResponse: providerResponse ? sanitize(JSON.stringify(providerResponse), { allowedTags: [] }) : undefined
    };

    // Verify order exists
    const orderDoc = await Order.findOne({ _id: sanitizedData.order, isActive: true });
    if (!orderDoc) {
      throw new APIError('Active order not found', 404);
    }

    // Verify user exists
    const userDoc = await User.findOne({ _id: sanitizedData.user, isActive: true });
    if (!userDoc) {
      throw new APIError('Active user not found', 404);
    }

    const newPayment = await Payment.create({
      ...sanitizedData,
      status: PaymentStatus.INITIATED,
      createdBy: req.user.id,
      isActive: true
    });

    const populatedPayment = await Payment.findById(newPayment._id)
      .populate('order', 'orderNumber total')
      .populate('user', 'name email')
      .select('-__v')
      .lean();

    logger.info({
      message: 'Payment created',
      paymentId: newPayment._id,
      userId: req.user.id,
      orderId: sanitizedData.order
    });

    return res.status(201).json({ message: 'Payment created successfully', payment: populatedPayment });
  } catch (error) {
    logger.error('Create payment error:', { error: error.message, body: req.body, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error creating payment' });
  }
};

/**
 * Get all payments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPayments = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { page = 1, status, user, order, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { isActive: true };

    if (status && !VALID_STATUSES.includes(status)) {
      throw new APIError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }
    if (status) filter.status = sanitize(status, { allowedTags: [] });

    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        throw new APIError('Invalid user ID', 400);
      }
      filter.user = sanitize(user, { allowedTags: [] });
    }

    if (order) {
      if (!mongoose.isValidObjectId(order)) {
        throw new APIError('Invalid order ID', 400);
      }
      filter.order = sanitize(order, { allowedTags: [] });
    }

    const pageNum = Number(page);
    const skip = (pageNum - 1) * ITEMS_PER_PAGE;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('order', 'orderNumber total')
        .populate('user', 'name email')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      Payment.countDocuments(filter)
    ]);

    return res.status(200).json({
      payments,
      pagination: {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    logger.error('Get payments error:', { error: error.message, query: req.query, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching payments' });
  }
};

/**
 * Get payments for current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMyPayments = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { page = 1, status, order, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { user: req.user.id, isActive: true };

    if (status && !VALID_STATUSES.includes(status)) {
      throw new APIError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }
    if (status) filter.status = sanitize(status, { allowedTags: [] });

    if (order) {
      if (!mongoose.isValidObjectId(order)) {
        throw new APIError('Invalid order ID', 400);
      }
      filter.order = sanitize(order, { allowedTags: [] });
    }

    const pageNum = Number(page);
    const skip = (pageNum - 1) * ITEMS_PER_PAGE;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('order', 'orderNumber total')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      Payment.countDocuments(filter)
    ]);

    return res.status(200).json({
      payments,
      pagination: {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    logger.error('Get my payments error:', { error: error.message, query: req.query, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching your payments' });
  }
};

/**
 * Get payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentById = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid payment ID', 400);
    }

    const payment = await Payment.findOne({ _id: id, isActive: true })
      .populate('order', 'orderNumber total')
      .populate('user', 'name email')
      .select('-__v')
      .lean();

    if (!payment) {
      throw new APIError('Payment not found', 404);
    }

    // Only owner or admin/manager can view payment
    if (payment.user.toString() !== req.user.id && ![UserRole.ADMIN, UserRole.MANAGER].includes(req.user.role)) {
      throw new APIError('Forbidden: You do not have permission to view this payment', 403);
    }

    return res.status(200).json({ payment });
  } catch (error) {
    logger.error('Get payment error:', { error: error.message, paymentId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching payment' });
  }
};

/**
 * Update payment status (admin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    const { status, providerResponse } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid payment ID', 400);
    }

    if (!status) {
      throw new APIError('Status is required', 400);
    }

    validatePaymentFields({ status });

    const sanitizedData = {
      status: sanitize(status, { allowedTags: [] }),
      providerResponse: providerResponse ? sanitize(JSON.stringify(providerResponse), { allowedTags: [] }) : undefined
    };

    const updates = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
    );

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('order', 'orderNumber total')
      .populate('user', 'name email')
      .select('-__v');

    if (!updatedPayment) {
      throw new APIError('Payment not found', 404);
    }

    logger.info({
      message: 'Payment status updated',
      paymentId: id,
      status: sanitizedData.status,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Payment status updated successfully', payment: updatedPayment });
  } catch (error) {
    logger.error('Update payment status error:', { error: error.message, paymentId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error updating payment' });
  }
};

/**
 * Delete payment (admin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePayment = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid payment ID', 400);
    }

    const deletedPayment = await Payment.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedPayment) {
      throw new APIError('Payment not found', 404);
    }

    logger.info({
      message: 'Payment deleted',
      paymentId: id,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    logger.error('Delete payment error:', { error: error.message, paymentId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error deleting payment' });
  }
};