"use strict";
// import express from "express";
// import {
//   createOrUpdateReview,
//   getReviewsByProduct,
//   getReviewById,
//   deleteReview,
// } from "../controllers/review.controller";
// import { authenticateJWT, authorize } from "../middlewares/auth.middleware";
// import { UserRole } from "../models/User";
// const router = express.Router();
// // Public routes
// router.get("/product/:productId", getReviewsByProduct);
// router.get("/:id", getReviewById);
// // Protected routes
// router.post("/", authenticateJWT, createOrUpdateReview);
// // Allow only admins or the review owner to delete
// router.delete(
//   "/:id",
//   authenticateJWT,
//   authorize([UserRole.ADMIN, UserRole.WEB_USER]), // USER can delete their own review
//   deleteReview
// );
// export default router;
