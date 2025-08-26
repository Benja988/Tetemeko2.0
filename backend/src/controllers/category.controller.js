import { Category } from '../models/Category.js';
import slugify from 'slugify';
import sanitize from 'sanitize-html';
import { UserRole } from '../models/User.js';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Predefined category types
const VALID_CATEGORY_TYPES = ['news', 'blog', 'podcast', 'video', 'Marketplace'];

/**
 * Check if user has required permissions
 * @param {Object} user - User object from request
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const checkPermissions = (user, allowedRoles) => {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new APIError(`Unauthorized: Only ${allowedRoles.join(' or ')} can perform this action`, 403);
  }
};

/**
 * Create a new category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCategory = async (req, res) => {
  try {
    checkPermissions(req.user, [UserRole.ADMIN, UserRole.MANAGER]);

    const { name, categoryType, description, seoTitle, seoDescription } = req.body;

    // Input validation
    if (!name || !categoryType) {
      throw new APIError('Name and categoryType are required', 400);
    }

    /*if (!VALID_CATEGORY_TYPES.includes(categoryType)) {
      throw new APIError(`Invalid category type. Must be one of: ${VALID_CATEGORY_TYPES.join(', ')}`, 400);
    }*/

    // Sanitize inputs
    const sanitizedData = {
      name: sanitize(name, { allowedTags: [] }),
      categoryType: sanitize(categoryType, { allowedTags: [] }),
      description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
      seoTitle: seoTitle ? sanitize(seoTitle, { allowedTags: [] }) : undefined,
      seoDescription: seoDescription ? sanitize(seoDescription, { allowedTags: [] }) : undefined
    };

    let slug = slugify(sanitizedData.name, { lower: true });
    let slugCounter = 1;
    while (await Category.findOne({ slug })) {
      slug = `${slugify(sanitizedData.name, { lower: true })}-${slugCounter}`;
      slugCounter++;
    }

    const category = new Category({
      ...sanitizedData,
      slug,
      createdBy: req.user?.id,
      isActive: true
    });

    await category.save();
    return res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Create category error:', { error: error.message, name: req.body.name });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Get all categories with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllCategories = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (type) {
      /*if (!VALID_CATEGORY_TYPES.includes(type)) {
        throw new APIError(`Invalid category type. Must be one of: ${VALID_CATEGORY_TYPES.join(', ')}`, 400);
      }*/
      filter.categoryType = sanitize(type, { allowedTags: [] });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [categories, total] = await Promise.all([
      Category.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Category.countDocuments(filter)
    ]);

    return res.status(200).json({
      categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Fetch categories error:', { error: error.message, type: req.query.type });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Get category by slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const sanitizedSlug = sanitize(slug, { allowedTags: [] });
    const category = await Category.findOne({ slug: sanitizedSlug, isActive: true }).select('-__v');

    if (!category) {
      throw new APIError('Category not found', 404);
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Fetch category error:', { error: error.message, slug: req.params.slug });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Update category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCategory = async (req, res) => {
  try {
    checkPermissions(req.user, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = req.params;
    const { name, categoryType, description, seoTitle, seoDescription } = req.body;

    if (!name && !categoryType && !description && !seoTitle && !seoDescription) {
      throw new APIError('At least one field is required for update', 400);
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name ? sanitize(name, { allowedTags: [] }) : undefined,
      categoryType: categoryType ? sanitize(categoryType, { allowedTags: [] }) : undefined,
      description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
      seoTitle: seoTitle ? sanitize(seoTitle, { allowedTags: [] }) : undefined,
      seoDescription: seoDescription ? sanitize(seoDescription, { allowedTags: [] }) : undefined
    };

    const updates = { ...sanitizedData };

    // If name changes, update slug as well
    if (sanitizedData.name) {
      let newSlug = slugify(sanitizedData.name, { lower: true });
      let slugCounter = 1;
      while (await Category.findOne({ slug: newSlug, _id: { $ne: id } })) {
        newSlug = `${slugify(sanitizedData.name, { lower: true })}-${slugCounter}`;
        slugCounter++;
      }
      updates.slug = newSlug;
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { ...updates, updatedBy: req.user?.id } },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedCategory) {
      throw new APIError('Category not found', 404);
    }

    return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error('Update category error:', { error: error.message, id: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};


/**
 * Delete category (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteCategory = async (req, res) => {
  try {
    checkPermissions(req.user, [UserRole.ADMIN]);

    const { id } = req.params;
    
    const deleted = await Category.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() } },
      { new: true }
    );

    if (!deleted) {
      throw new APIError('Category not found', 404);
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', { error: error.message, id: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};
