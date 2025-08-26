import express from "express";
import {
  placeOrder,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", placeOrder);             // place order from cart
router.get("/", getOrders);               // list orders (user or admin)
router.put("/:id/status", updateOrderStatus); // update status

export default router;
