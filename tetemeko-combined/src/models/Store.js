import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Store name is required"], unique: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Owner is required"] },
  logo: { type: String },
  description: { type: String },
  address: {
    line1: { type: String, required: [true, "Address line 1 is required"] },
    city: { type: String, required: [true, "City is required"] },
    state: { type: String },
    country: { type: String, required: [true, "Country is required"] },
    postalCode: { type: String }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

storeSchema.index({ name: 1 }, { unique: true });

export const Store = mongoose.model("Store", storeSchema);