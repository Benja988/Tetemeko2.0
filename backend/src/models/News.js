import mongoose from 'mongoose';
import sanitize from 'sanitize-html';

// Enum for news status
export const NewsStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    set: v => sanitize(v, { allowedTags: [] })
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    set: v => sanitize(v, { allowedTags: [] })
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [1, 'Content must be at least 1 character'],
    set: v => sanitize(v, { allowedTags: ['p', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li'] })
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [500, 'Summary cannot exceed 500 characters'],
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true,
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  }],
  status: {
    type: String,
    enum: Object.values(NewsStatus),
    default: NewsStatus.DRAFT
  },
  publishedAt: {
    type: Date,
    default: null
  },
  thumbnail: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(https?:\/\/)/i.test(v);
      },
      message: 'Thumbnail must be a valid URL'
    },
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  featuredImage: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(https?:\/\/)/i.test(v);
      },
      message: 'Featured image must be a valid URL'
    },
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  videoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(https?:\/\/)/i.test(v);
      },
      message: 'Video URL must be a valid URL'
    },
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [200, 'SEO title cannot exceed 200 characters'],
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'SEO description cannot exceed 500 characters'],
    set: v => v ? sanitize(v, { allowedTags: [] }) : v
  },
  readingTime: {
    type: Number,
    // min: [, 'Reading time cannot be negative'],
    default: 30
  },
  viewsCount: {
    type: Number,
    default: 0,
    min: [0, 'Views count cannot be negative']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
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
NewsSchema.index({ slug: 1 }, { unique: true });
NewsSchema.index({ title: 'text', content: 'text', tags: 'text' });
NewsSchema.index({ isActive: 1, status: 1, isPublished: 1 });
NewsSchema.index({ author: 1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ publishedAt: -1 });

// Pre-save hook for slug generation and uniqueness
NewsSchema.pre('save', async function(next) {
  if (this.isModified('title') || !this.slug) {
    // Generate slug from title
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug uniqueness
    while (await mongoose.model('News').findOne({ slug, _id: { $ne: this._id }, isActive: true })) {
      slug = `${baseSlug}-${counter++}`;
    }
    
    this.slug = slug;
  }

  // Update publishedAt when status changes to published
  if (this.isModified('status') && this.status === NewsStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtual for word count
NewsSchema.virtual('wordCount').get(function() {
  return this.content ? this.content.split(/\s+/).length : 0;
});

export const News = mongoose.model('News', NewsSchema);