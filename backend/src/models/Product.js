import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"], trim: true },
  slug: { type: String, unique: true, lowercase: true, index: true },
  description: { type: String, required: [true, "Description is required"] },
  images: [{ type: String }],
  price: { type: Number, required: [true, "Price is required"], min: [0, "Price cannot be negative"] },
  discount: { 
    type: Number, 
    default: 0, 
    min: [0, "Discount cannot be negative"], 
    max: [100, "Discount cannot exceed 100%"] 
  },
  stock: { type: Number, required: [true, "Stock is required"], min: [0, "Stock cannot be negative"] },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: [true, "Category is required"] 
  },
  categoryType: { 
    type: String, 
    enum: ["marketplace"], 
    default: "marketplace" 
  },
  tags: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: [true, "Seller is required"] },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "CreatedBy is required"] },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Generate slug before saving
productSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Ensure unique slug
productSchema.pre("save", async function (next) {
  try {
    if (this.isModified("slug")) {
      const existing = await mongoose.model("Product").findOne({ slug: this.slug });
      if (existing && existing._id.toString() !== this._id.toString()) {
        this.slug = `${this.slug}-${Date.now()}`;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

productSchema.index({ slug: 1 }, { unique: true });

export const Product = mongoose.model("Product", productSchema);