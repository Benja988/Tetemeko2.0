import express from "express";
import {
  createStore,
  getStores,
  updateStore,
  deleteStore
} from "../controllers/storeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createStore);        // create store
router.get("/", getStores);           // list stores
router.put("/:id", updateStore);      // update store
router.delete("/:id", deleteStore);   // soft delete

export default router;
