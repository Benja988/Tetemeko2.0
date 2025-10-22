import mongoose from 'mongoose';

const EpisodeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  audioUrl: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^https:\/\/res\.cloudinary\.com\//.test(url),
      message: 'audioUrl must be a valid Cloudinary URL',
    },
  },
  duration: { type: Number, required: true, min: [1, 'Duration must be positive'] },
  publishedDate: { type: Date, default: Date.now },
  podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isActive: { type: Boolean, default: true },
  episodeNumber: { type: Number, min: [1, 'Episode number must be positive'] },
  tags: [{ type: String, trim: true }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Ensure indexes for faster queries
EpisodeSchema.index({ podcast: 1, createdBy: 1 });

export default mongoose.model('Episode', EpisodeSchema);