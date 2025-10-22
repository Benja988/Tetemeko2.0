import { Store } from "../models/Store.js";
import { uploadMedia } from "../utils/cloudinary.js";
import sanitize from "sanitize-html";
import logger from "../utils/logger.js";

// Sanitize inputs
const sanitizeInput = (input) => {
  return sanitize(input, { allowedTags: [] });
};

// Create store (web_user can own one, admin/manager can create many)
export const createStore = async (req, res) => {
  try {
    const existingStore = await Store.findOne({ owner: req.user._id, isActive: true });
    if (existingStore && req.user.role === "web_user") {
      return res.status(400).json({ message: "You already own a store" });
    }

    const { name, description, address } = req.body;
    const sanitizedInput = {
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : undefined,
      address: {
        line1: sanitizeInput(address.line1),
        city: sanitizeInput(address.city),
        state: address.state ? sanitizeInput(address.state) : undefined,
        country: sanitizeInput(address.country),
        postalCode: address.postalCode ? sanitizeInput(address.postalCode) : undefined
      }
    };

    let logo;
    if (req.file) {
      const uploadResult = await uploadMedia(req.file, "stores", "image", { tags: ["store", sanitizedInput.name] });
      logo = uploadResult.secure_url;
    }

    const store = new Store({
      ...sanitizedInput,
      logo,
      owner: req.user._id
    });
    await store.save();
    const populatedStore = await Store.findById(store._id).populate("owner").lean();
    res.status(201).json(populatedStore);
  } catch (err) {
    logger.error("Failed to create store", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};

// Get stores
export const getStores = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const stores = await Store.find({ isActive: true })
      .populate("owner")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();
    res.json({
      stores,
      page: Number(page),
      limit: Number(limit),
      total: await Store.countDocuments({ isActive: true })
    });
  } catch (err) {
    logger.error("Failed to get stores", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update store
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    if (String(store.owner) !== String(req.user._id) && !["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, description, address } = req.body;
    const sanitizedInput = {
      name: name ? sanitizeInput(name) : store.name,
      description: description ? sanitizeInput(description) : store.description,
      address: {
        line1: address?.line1 ? sanitizeInput(address.line1) : store.address.line1,
        city: address?.city ? sanitizeInput(address.city) : store.address.city,
        state: address?.state ? sanitizeInput(address.state) : store.address.state,
        country: address?.country ? sanitizeInput(address.country) : store.address.country,
        postalCode: address?.postalCode ? sanitizeInput(address.postalCode) : store.address.postalCode
      }
    };

    let logo = store.logo;
    if (req.file) {
      const uploadResult = await uploadMedia(req.file, "stores", "image", { tags: ["store", sanitizedInput.name] });
      logo = uploadResult.secure_url;
    }

    Object.assign(store, sanitizedInput, { logo });
    await store.save();
    const populatedStore = await Store.findById(store._id).populate("owner").lean();
    res.json(populatedStore);
  } catch (err) {
    logger.error("Failed to update store", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};

// Soft delete store
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    if (String(store.owner) !== String(req.user._id) && !["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    store.isActive = false;
    await store.save();
    res.json({ message: "Store soft-deleted", store });
  } catch (err) {
    logger.error("Failed to delete store", { error: err.message, userId: req.user._id });
    res.status(500).json({ message: "Internal server error" });
  }
};