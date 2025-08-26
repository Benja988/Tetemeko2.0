"use strict";
// import { Request, Response } from 'express';
// import { Coupon } from '../models/Coupon';
// import mongoose from 'mongoose';
// // Create a new coupon (Admin)
// export const createCoupon = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       code,
//       discountType,
//       discountValue,
//       minOrderValue,
//       maxDiscountAmount,
//       maxUsage,
//       expiresAt,
//       isActive,
//     } = req.body;
//     const existing = await Coupon.findOne({ code: code.toUpperCase() });
//     if (existing) {
//       res.status(400).json({ message: 'Coupon code already exists' });
//       return;
//     }
//     const newCoupon = new Coupon({
//       code: code.toUpperCase(),
//       discountType,
//       discountValue,
//       minOrderValue,
//       maxDiscountAmount,
//       maxUsage,
//       expiresAt,
//       isActive,
//     });
//     const saved = await newCoupon.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating coupon', error });
//   }
// };
// // Get all coupons (Admin)
// export const getAllCoupons = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const coupons = await Coupon.find().sort({ createdAt: -1 });
//     res.status(200).json(coupons);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching coupons', error });
//   }
// };
// // Get single coupon by ID (Admin)
// export const getCouponById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const coupon = await Coupon.findById(id);
//     if (!coupon) {
//       res.status(404).json({ message: 'Coupon not found' });
//       return;
//     }
//     res.status(200).json(coupon);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching coupon', error });
//   }
// };
// // Update coupon (Admin)
// export const updateCoupon = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
//     const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });
//     if (!coupon) {
//       res.status(404).json({ message: 'Coupon not found' });
//       return;
//     }
//     res.status(200).json(coupon);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating coupon', error });
//   }
// };
// // Delete coupon (Admin)
// export const deleteCoupon = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const deleted = await Coupon.findByIdAndDelete(id);
//     if (!deleted) {
//       res.status(404).json({ message: 'Coupon not found' });
//       return;
//     }
//     res.status(200).json({ message: 'Coupon deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting coupon', error });
//   }
// };
// // Validate and apply coupon (User)
// export const applyCoupon = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { code, orderAmount } = req.body;
//     const userId = req.user?.id;
//     const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
//     if (!coupon) {
//       res.status(404).json({ message: 'Invalid or expired coupon' });
//       return;
//     }
//     if (new Date() > coupon.expiresAt) {
//       res.status(400).json({ message: 'Coupon has expired' });
//       return;
//     }
//     if (coupon.usedBy.includes(new mongoose.Types.ObjectId(userId))) {
//       res.status(400).json({ message: 'You have already used this coupon' });
//       return;
//     }
//     if (coupon.usedCount >= coupon.maxUsage) {
//       res.status(400).json({ message: 'Coupon usage limit reached' });
//       return;
//     }
//     if (orderAmount < coupon.minOrderValue) {
//       res.status(400).json({
//         message: `Minimum order value to apply this coupon is ${coupon.minOrderValue}`,
//       });
//       return;
//     }
//     let discount = 0;
//     if (coupon.discountType === 'percent') {
//       discount = (orderAmount * coupon.discountValue) / 100;
//       if (coupon.maxDiscountAmount) {
//         discount = Math.min(discount, coupon.maxDiscountAmount);
//       }
//     } else {
//       discount = coupon.discountValue;
//     }
//     const finalAmount = orderAmount - discount;
//     res.status(200).json({
//       valid: true,
//       discount,
//       finalAmount,
//       coupon: coupon.code,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error applying coupon', error });
//   }
// };
