"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_controller_1 = require("../controllers/payments.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Create a payment (authenticated users)
router.post('/', auth_middleware_1.authenticateJWT, payments_controller_1.createPayment);
// Get all payments (admin only)
router.get('/', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), payments_controller_1.getAllPayments);
// Get current user's payments
router.get('/me', auth_middleware_1.authenticateJWT, payments_controller_1.getMyPayments);
// Get payment by ID (owner or admin)
router.get('/:id', auth_middleware_1.authenticateJWT, payments_controller_1.getPaymentById);
// Update payment status (admin only)
router.patch('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), payments_controller_1.updatePaymentStatus);
// Delete payment (admin only)
router.delete('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), payments_controller_1.deletePayment);
exports.default = router;
