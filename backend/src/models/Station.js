import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  streamUrl: { type: String }, // optional
  imageUrl: { type: String, required: false }, // renamed from logoUrl
  location: { type: String, required: true },
  genre: [{ type: String }],
  isActive: { type: Boolean, default: true },
  type: {
    type: String,
    enum: ['Radio Station', 'TV Station'],
    required: true,
  },
  liveShow: { type: String },
  listenerz: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date }
}, { timestamps: true });

// Log connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', {
    error: error.message,
    stack: error.stack
  });
});

// Log when connection is established
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

export default mongoose.model('Station', StationSchema);