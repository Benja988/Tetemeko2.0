// src/models/Podcast.js

import mongoose from 'mongoose';

const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: [200, 'Title cannot exceed 200 characters'] },
  description: { type: String, required: true, trim: true },
  coverImage: {
    type: String,
    validate: {
      validator: (url) => !url || /^https:\/\/res\.cloudinary\.com\//.test(url),
      message: 'coverImage must be a valid Cloudinary URL',
    },
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isActive: { type: Boolean, default: true },
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
  tags: [{ type: String, trim: true }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Ensure indexes for faster queries
PodcastSchema.index({ category: 1, createdBy: 1 });

export default mongoose.model('Podcast', PodcastSchema);