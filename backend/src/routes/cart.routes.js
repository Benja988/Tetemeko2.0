import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCart);                     // view cart
router.post("/add", addToCart);               // add product to cart
router.delete("/remove/:productId", removeFromCart); // remove product

export default router;
