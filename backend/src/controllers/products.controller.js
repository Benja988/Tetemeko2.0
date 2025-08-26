import { Product } from "../models/Product.js";
import { uploadMedia } from "../utils/cloudinary.js";
import sanitize from "sanitize-html";
import logger from "../utils/logger.js";

// Sanitize inputs
const sanitizeInput = (input) => {
  return sanitize(input, { allowedTags: [] });
};

// Create product (store owner only)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, stock, category, tags } = req.body;
    const sanitizedInput = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      price: Number(sanitizeInput(price)),
      discount: Number(sanitizeInput(discount) || 0),
      stock: Number(sanitizeInput(stock)),
      category: sanitizeInput(category),
      tags: Array.isArray(tags) ? tags.map(tag => sanitizeInput(tag)) : []
    };

    let images = [];
    if (req.files && Array.isArray(req.files)) {
      images = await Promise.all(
        req.files.map(file => uploadMedia(file, "products", "image", { tags: ["product", sanitizedInput.title] }))
      );
      images = images.map(img => img.secure_url);
    }

    const product = new Product({
      ...sanitizedInput,
      images,
      seller: req.user._id,
      createdBy: req.user._id
    });

    await product.save();
    const populatedProduct = await Product.findById(product._id).populate("category seller").lean();
    res.status(201).json(populatedProduct);
  } catch (err) {
    logger.error("Failed to create product", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};

// Get all products (filter by category, store, featured)
export const getProducts = async (req, res) => {
  try {
    const { category, store, featured, page = 1, limit = 10 } = req.query;
    const filter = { status: "active" };

    if (category) filter.category = sanitizeInput(category);
    if (store) filter.seller = sanitizeInput(store);
    if (featured) filter.isFeatured = sanitizeInput(featured) === "true";

    const products = await Product.find(filter)
      .populate("category seller")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      products,
      page: Number(page),
      limit: Number(limit),
      total: await Product.countDocuments(filter),
    });
  } catch (err) {
    logger.error("Failed to get products", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update product (owner or admin/manager)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (String(product.seller) !== String(req.user._id) && !["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sanitizedInput = {
      title: req.body.title ? sanitizeInput(req.body.title) : product.title,
      description: req.body.description ? sanitizeInput(req.body.description) : product.description,
      price: req.body.price ? Number(sanitizeInput(req.body.price)) : product.price,
      discount: req.body.discount ? Number(sanitizeInput(req.body.discount)) : product.discount,
      stock: req.body.stock ? Number(sanitizeInput(req.body.stock)) : product.stock,
      category: req.body.category ? sanitizeInput(req.body.category) : product.category,
      tags: Array.isArray(req.body.tags) ? req.body.tags.map(tag => sanitizeInput(tag)) : product.tags,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured
    };

    let images = product.images;
    if (req.files && Array.isArray(req.files)) {
      images = await Promise.all(
        req.files.map(file => uploadMedia(file, "products", "image", { tags: ["product", sanitizedInput.title] }))
      );
      images = images.map(img => img.secure_url);
    }

    Object.assign(product, sanitizedInput, { images, updatedBy: req.user._id });
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate("category seller").lean();
    res.json(populatedProduct);
  } catch (err) {
    logger.error("Failed to update product", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};

// Soft delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (String(product.seller) !== String(req.user._id) && !["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    product.status = "inactive";
    await product.save();
    res.json({ message: "Product soft-deleted", product });
  } catch (err) {
    logger.error("Failed to delete product", { error: err.message, userId: req.user._id });
    res.status(500).json({ message: "Internal server error" });
  }
};