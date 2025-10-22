import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Pre-save hook to calculate totalAmount
cartSchema.pre("save", async function (next) {
  try {
    let total = 0;
    for (const item of this.items) {
      const product = await mongoose.model("Product").findById(item.product);
      if (!product || product.status !== "active") {
        throw new Error(`Invalid or inactive product: ${item.product}`);
      }
      total += product.price * (1 - product.discount / 100) * item.quantity;
    }
    this.totalAmount = total;
    next();
  } catch (err) {
    next(err);
  }
});

// Validate product existence and stock before adding to cart
cartSchema.pre("validate", async function (next) {
  try {
    for (const item of this.items) {
      const product = await mongoose.model("Product").findById(item.product);
      if (!product || product.status !== "active") {
        throw new Error(`Product not found or inactive: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.title}: ${product.stock} available`);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const Cart = mongoose.model("Cart", cartSchema);