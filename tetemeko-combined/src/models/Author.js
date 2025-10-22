import mongoose from 'mongoose';
import sanitize from 'sanitize-html';

// Enum for author status
export const AuthorStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    set: v => sanitize(v, { allowedTags: [] })
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/undefined email
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Invalid email format'
    },
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    set: v => v ? sanitize(v, { allowedTags: ['p', 'strong', 'em'] }) : v
  },
  avatar: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/undefined avatar
        return /^(https?:\/\/)/i.test(v);
      },
      message: 'Avatar must be a valid URL'
    },
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  role: {
    type: String,
    enum: ['author', 'editor', 'admin'],
    default: 'author'
  },
  status: {
    type: String,
    enum: Object.values(AuthorStatus),
    default: AuthorStatus.ACTIVE
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialMedia: {
    twitter: { type: String, trim: true, set: v => v ? sanitize(v, { allowedTags: [] }) : v },
    linkedin: { type: String, trim: true, set: v => v ? sanitize(v, { allowedTags: [] }) : v },
    website: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^(https?:\/\/)/i.test(v);
        },
        message: 'Website must be a valid URL'
      },
      set: v => v ? sanitize(v, { allowedTags: [] }) : v
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AuthorSchema.index({ email: 1 }, { unique: true, sparse: true });
AuthorSchema.index({ name: 'text', bio: 'text' });
AuthorSchema.index({ isActive: 1, status: 1 });

// Pre-save hook to ensure email uniqueness
AuthorSchema.pre('save', async function(next) {
  if (this.isModified('email') && this.email) {
    const existing = await mongoose.model('Author').findOne({ 
      email: this.email, 
      _id: { $ne: this._id },
      isActive: true 
    });
    if (existing) {
      throw new Error('Email already exists');
    }
  }
  next();
});

// Virtual for full name (if needed in future)
AuthorSchema.virtual('fullName').get(function() {
  return this.name;
});

export const Author = mongoose.model('Author', AuthorSchema);