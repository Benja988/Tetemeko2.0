import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { sendEmail } from "../utils/email.js";
import sanitize from "sanitize-html";
import logger from "../utils/logger.js";

// Sanitize inputs
const sanitizeInput = (input) => {
  return sanitize(input, { allowedTags: [] });
};

// Place order from cart
export const placeOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: req.user._id, isActive: true })
      .populate("items.product")
      .session(session);
    if (!cart || !cart.items.length) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Sanitize shipping address
    const { shippingAddress } = req.body;
    const sanitizedAddress = {
      line1: sanitizeInput(shippingAddress.line1),
      city: sanitizeInput(shippingAddress.city),
      country: sanitizeInput(shippingAddress.country),
      postalCode: shippingAddress.postalCode ? sanitizeInput(shippingAddress.postalCode) : undefined
    };

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Insufficient stock for ${item.product.title}: ${item.product.stock} available` });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price * (1 - i.product.discount / 100)
      })),
      totalAmount: cart.totalAmount,
      shippingAddress: sanitizedAddress
    });

    // Decrement stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await order.save({ session });
    cart.isActive = false;
    await cart.save({ session });

    await session.commitTransaction();

    // Send order confirmation email
    const user = await mongoose.model("User").findById(req.user._id);
    const emailContent = {
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order, ${user.name}!</p>
        <h3>Order Details</h3>
        <ul>
          ${cart.items.map(item => `<li>${item.product.title} - Quantity: ${item.quantity} - Price: $${(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}</li>`).join("")}
        </ul>
        <p>Total Amount: $${cart.totalAmount.toFixed(2)}</p>
        <p>Shipping Address: ${sanitizedAddress.line1}, ${sanitizedAddress.city}, ${sanitizedAddress.country}</p>
      `,
      text: `Order Confirmation\nThank you for your order, ${user.name}!\n\nOrder Details:\n${cart.items.map(item => `- ${item.product.title} - Quantity: ${item.quantity} - Price: $${(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}`).join("\n")}\n\nTotal Amount: $${cart.totalAmount.toFixed(2)}\nShipping Address: ${sanitizedAddress.line1}, ${sanitizedAddress.city}, ${sanitizedAddress.country}`
    };

    await sendEmail(user.email, "Order Confirmation", emailContent);

    const populatedOrder = await Order.findById(order._id).populate("items.product user").lean();
    res.status(201).json(populatedOrder);
  } catch (err) {
    await session.abortTransaction();
    logger.error("Failed to place order", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter).populate("items.product user").lean();
    res.json(orders);
  } catch (err) {
    logger.error("Failed to get orders", { error: err.message, userId: req.user._id });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status (admin/manager only)
export const updateOrderStatus = async (req, res) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sanitizedStatus = sanitizeInput(req.body.status);
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(sanitizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: sanitizedStatus },
      { new: true }
    ).populate("items.product user").lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    logger.error("Failed to update order status", { error: err.message, userId: req.user._id });
    res.status(400).json({ message: err.message });
  }
};