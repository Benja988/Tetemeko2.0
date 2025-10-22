import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, min: [0, "Total amount cannot be negative"] },
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  shippingAddress: {
    line1: { type: String, required: [true, "Address line 1 is required"] },
    city: { type: String, required: [true, "City is required"] },
    country: { type: String, required: [true, "Country is required"] },
    postalCode: { type: String }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);