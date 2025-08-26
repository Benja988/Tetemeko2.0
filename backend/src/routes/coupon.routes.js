"use strict";
// import express from 'express';
// import {
//   createCoupon,
//   getAllCoupons,
//   getCouponById,
//   updateCoupon,
//   deleteCoupon,
//   applyCoupon,
// } from '../controllers/coupons.controller';
// import { authenticateJWT, authorize } from '../middlewares/auth.middleware';
// import { UserRole } from '../models/User';
// const router = express.Router();
// // Admin routes - require authentication and admin role
// router.post('/', authenticateJWT, authorize([UserRole.ADMIN]), createCoupon);
// router.get('/', authenticateJWT, authorize([UserRole.ADMIN]), getAllCoupons);
// router.get('/:id', authenticateJWT, authorize([UserRole.ADMIN]), getCouponById);
// router.put('/:id', authenticateJWT, authorize([UserRole.ADMIN]), updateCoupon);
// router.delete('/:id', authenticateJWT, authorize([UserRole.ADMIN]), deleteCoupon);
// // Public/user route to apply coupon (must be authenticated)
// router.post('/apply', authenticateJWT, applyCoupon);
// export default router;
