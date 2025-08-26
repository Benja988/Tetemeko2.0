import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProduct);         // create product
router.get("/", getProducts);            // list products
router.put("/:id", updateProduct);       // update product
router.delete("/:id", deleteProduct);    // soft delete

export default router;
