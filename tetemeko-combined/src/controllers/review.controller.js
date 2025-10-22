"use strict";
// import { Request, Response } from 'express';
// import { Review } from '../models/Review'; // Adjust path as needed
// import mongoose from 'mongoose';
// // Create or update a review
// export const createOrUpdateReview = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const { product, rating, comment } = req.body;
//     const existingReview = await Review.findOne({ user: userId, product });
//     if (existingReview) {
//       existingReview.rating = rating;
//       existingReview.comment = comment;
//       const updatedReview = await existingReview.save();
//       res.status(200).json(updatedReview);
//     } else {
//       const newReview = new Review({
//         user: userId,
//         product,
//         rating,
//         comment,
//       });
//       const savedReview = await newReview.save();
//       res.status(201).json(savedReview);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating or updating review', error });
//   }
// };
// // Get all reviews for a product
// export const getReviewsByProduct = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { productId } = req.params;
//     const reviews = await Review.find({ product: productId })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching reviews', error });
//   }
// };
// // Get a single review by ID
// export const getReviewById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const review = await Review.findById(id).populate('user', 'name email');
//     if (!review) {
//       res.status(404).json({ message: 'Review not found' });
//       return;
//     }
//     res.status(200).json(review);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching review', error });
//   }
// };
// // Delete a review (user or admin)
// export const deleteReview = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?.id;
//     const isAdmin = req.user?.role === 'admin';
//     const review = await Review.findById(id);
//     if (!review) {
//       res.status(404).json({ message: 'Review not found' });
//       return;
//     }
//     if (!isAdmin && review.user.toString() !== userId?.toString()) {
//       res.status(403).json({ message: 'Not authorized to delete this review' });
//       return;
//     }
//     await review.deleteOne();
//     res.status(200).json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting review', error });
//   }
// };
