import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import sanitize from "sanitize-html";
import logger from "../utils/logger.js";

// Sanitize inputs
const sanitizeInput = (input) => {
  return sanitize(input, { allowedTags: [] });
};

// Optimized calculateTotal helper
const calculateTotal = async (items) => {
  const productIds = items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds }, status: "active" });
  let total = 0;

  for (const item of items) {
    const product = products.find(p => String(p._id) === String(item.product));
    if (product) {
      total += product.price * (1 - product.discount / 100) * item.quantity;
    }
  }
  return total;
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id, isActive: true })
      .populate("items.product")
      .lean();
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (err) {
    logger.error("Failed to get cart", { error: err.message, userId: req.user._id });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const sanitizedProductId = sanitizeInput(productId);
    const sanitizedQuantity = Number(sanitizeInput(quantity));

    if (!sanitizedProductId || isNaN(sanitizedQuantity) || sanitizedQuantity < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    const product = await Product.findById(sanitizedProductId);
    if (!product || product.status !== "active") {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    if (product.stock < sanitizedQuantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.title}: ${product.stock} available` });
    }

    let cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const item = cart.items.find(i => String(i.product) === sanitizedProductId);
    if (item) {
      const newQuantity = item.quantity + sanitizedQuantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}: ${product.stock} available` });
      }
      item.quantity = newQuantity;
    } else {
      cart.items.push({ product: sanitizedProductId, quantity: sanitizedQuantity });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.product").lean();
    res.json(populatedCart);
  } catch (err) {
    logger.error("Failed to add to cart", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const sanitizedProductId = sanitizeInput(productId);

    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(i => String(i.product) !== sanitizedProductId);
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.product").lean();
    res.json(populatedCart);
  } catch (err) {
    logger.error("Failed to remove from cart", { error: err.message, userId: req.user._id });
    res.status(500).json({ message: "Internal server error" });
  }
};