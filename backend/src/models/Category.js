import mongoose from 'mongoose';
import sanitize from 'sanitize-html';

// Enum for category types
export const CategoryType = {
  NEWS: 'news',
  MARKETPLACE: 'marketplace',
  PODCAST: 'podcast'
};

// Category schema definition
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    set: (value) => sanitize(value, { allowedTags: [] })
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    minlength: [1, 'Slug must be at least 1 character'],
    maxlength: [100, 'Slug cannot exceed 100 characters'],
    match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    set: (value) => sanitize(value.toLowerCase(), { allowedTags: [] })
  },
  categoryType: {
    type: String,
    enum: {
      values: Object.values(CategoryType),
      message: 'Invalid category type. Must be one of: {VALUE}'
    },
    required: [true, 'Category type is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    set: (value) => value ? sanitize(value, { allowedTags: ['p', 'strong', 'em'] }) : undefined
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters'],
    set: (value) => value ? sanitize(value, { allowedTags: [] }) : undefined
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters'],
    set: (value) => value ? sanitize(value, { allowedTags: [] }) : undefined
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
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
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ categoryType: 1 });
CategorySchema.index({ isActive: 1, createdAt: -1 });

// Pre-save middleware to validate and handle slug uniqueness
CategorySchema.pre('save', async function(next) {
  if (!this.isModified('slug')) return next();

  let slug = this.slug;
  let counter = 1;
  while (await this.constructor.findOne({ slug, _id: { $ne: this._id }, isActive: true })) {
    slug = `${this.slug}-${counter}`;
    counter++;
  }
  this.slug = slug;
  next();
});

// Pre-validate middleware to ensure referenced user exists
CategorySchema.pre('save', async function(next) {
  if (this.isModified('createdBy') || this.isModified('updatedBy')) {
    const User = mongoose.model('User');
    const userIds = [this.createdBy, this.updatedBy].filter(id => id);
    if (userIds.length) {
      const users = await User.find({ _id: { $in: userIds }, isActive: true });
      if (users.length !== userIds.length) {
        return next(new Error('One or more referenced users not found or inactive'));
      }
    }
  }
  next();
});

// Static method to check if a slug is available
CategorySchema.statics.isSlugAvailable = async function(slug, excludeId) {
  const query = { slug, isActive: true };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return !(await this.findOne(query));
};

// Virtual for related items count (e.g., products or podcasts)
CategorySchema.virtual('itemsCount', {
  ref: (doc) => doc.categoryType === CategoryType.PODCAST ? 'Podcast' : 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { isActive: true }
});

// Category model
export const Category = mongoose.model('Category', CategorySchema);