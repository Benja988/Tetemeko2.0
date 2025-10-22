import mongoose from 'mongoose';
import { News } from '../models/News.js';
import { Author } from '../models/Author.js';
import { Category } from '../models/Category.js';
import User, { UserRole } from '../models/User.js';
import { uploadMedia } from '../utils/uploadMedia.js';
import sanitize from 'sanitize-html';
import logger from '../utils/logger.js';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ITEMS_PER_PAGE = 20;

// Check permissions for admin or manager actions
const checkAdminPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate news fields
const validateNewsFields = ({ title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking }) => {
  // if (!title || typeof title !== 'string' || title.length < 1 || title.length > 200) {
  //   throw new APIError('Title is required and must be 1-200 characters', 400);
  // }
  if (!content || typeof content !== 'string' || content.length < 1) {
    throw new APIError('Content is required', 400);
  }
  if (summary && (typeof summary !== 'string' || summary.length > 500)) {
    throw new APIError('Summary must be a string up to 500 characters', 400);
  }
  if (!author || !mongoose.isValidObjectId(author)) {
    throw new APIError('Valid author ID is required', 400);
  }
  if (!category || !mongoose.isValidObjectId(category)) {
    throw new APIError('Valid category ID is required', 400);
  }
  if (tags && (!Array.isArray(tags) || tags.some(t => typeof t !== 'string'))) {
    throw new APIError('Tags must be an array of strings', 400);
  }
  if (publishedAt && isNaN(new Date(publishedAt).getTime())) {
    throw new APIError('Invalid publishedAt date format', 400);
  }
  if (isPublished !== undefined && typeof isPublished !== 'boolean') {
    throw new APIError('isPublished must be a boolean', 400);
  }
  if (thumbnail && !thumbnail.startsWith('data:image/') && !thumbnail.startsWith('http')) {
    throw new APIError('Invalid thumbnail image format', 400);
  }
  if (featuredImage && !featuredImage.startsWith('data:image/') && !featuredImage.startsWith('http')) {
    throw new APIError('Invalid featured image format', 400);
  }
  if (videoUrl && !videoUrl.startsWith('data:video/') && !videoUrl.startsWith('http')) {
    throw new APIError('Invalid video URL format', 400);
  }
  if (seoTitle && (typeof seoTitle !== 'string' || seoTitle.length > 200)) {
    throw new APIError('SEO title must be a string up to 200 characters', 400);
  }
  if (seoDescription && (typeof seoDescription !== 'string' || seoDescription.length > 500)) {
    throw new APIError('SEO description must be a string up to 500 characters', 400);
  }
  if (readingTime !== undefined && (typeof readingTime !== 'number' || readingTime <= 0)) {
    throw new APIError('Reading time must be a positive number', 400);
  }
  if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
    throw new APIError('isFeatured must be a boolean', 400);
  }
  if (isBreaking !== undefined && typeof isBreaking !== 'boolean') {
    throw new APIError('isBreaking must be a boolean', 400);
  }
};

/**
 * Create a new news post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createNews = async (req, res) => {
  try {
    checkAdminPermissions(req.user);
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking } = req.body;

    validateNewsFields({ title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking });

    const sanitizedData = {
      title: sanitize(title, { allowedTags: [] }),
      content: sanitize(content, { allowedTags: ['p', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li'] }),
      summary: summary ? sanitize(summary, { allowedTags: [] }) : undefined,
      author: sanitize(author, { allowedTags: [] }),
      category: sanitize(category, { allowedTags: [] }),
      tags: tags ? tags.map(t => sanitize(t, { allowedTags: [] })) : undefined,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      isPublished: isPublished !== undefined ? isPublished : false,
      thumbnail,
      featuredImage,
      videoUrl,
      seoTitle: seoTitle ? sanitize(seoTitle, { allowedTags: [] }) : undefined,
      seoDescription: seoDescription ? sanitize(seoDescription, { allowedTags: [] }) : undefined,
      readingTime,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isBreaking: isBreaking !== undefined ? isBreaking : false
    };

    // Verify author and category exist
    const [authorDoc, categoryDoc] = await Promise.all([
      Author.findOne({ _id: sanitizedData.author, isActive: true }),
      Category.findOne({ _id: sanitizedData.category, isActive: true })
    ]);

    // if (!authorDoc) {
    //   throw new APIError('Active author not found', 404);
    // }
    if (!categoryDoc) {
      throw new APIError('Active category not found', 404);
    }

    let uploadedThumbnail = sanitizedData.thumbnail;
    let uploadedFeaturedImage = sanitizedData.featuredImage;
    let uploadedVideoUrl = sanitizedData.videoUrl;

    if (req.file) {
      try {
        const uploaded = await uploadMedia(req.file, 'news/thumbnails');
        uploadedThumbnail = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload thumbnail', 500);
      }
    } else if (sanitizedData.thumbnail?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.thumbnail, 'news/thumbnails');
        uploadedThumbnail = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload thumbnail', 500);
      }
    }

    if (sanitizedData.featuredImage?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.featuredImage, 'news/featured');
        uploadedFeaturedImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload featured image', 500);
      }
    }

    if (sanitizedData.videoUrl?.startsWith('data:video/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.videoUrl, 'news/videos', 'video');
        uploadedVideoUrl = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload video', 500);
      }
    }

    const news = await News.create({
      ...sanitizedData,
      thumbnail: uploadedThumbnail,
      featuredImage: uploadedFeaturedImage,
      videoUrl: uploadedVideoUrl,
      createdBy: req.user.id,
      isActive: true
    });

    const populatedNews = await News.findById(news._id)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .select('-__v')
      .lean();

    logger.info({
      message: 'News created',
      newsId: news._id,
      title: sanitizedData.title,
      userId: req.user.id
    });

    return res.status(201).json({ message: 'News created successfully', news: populatedNews });
  } catch (error) {
    logger.error('Create news error:', { error: error.message, body: req.body, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get all news with optional filters & pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = ITEMS_PER_PAGE, category, tag, author, isPublished, sortBy = 'publishedAt', sortOrder = 'desc' } = req.query;
    const filter = { isActive: true };

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        throw new APIError('Invalid category ID', 400);
      }
      filter.category = sanitize(category, { allowedTags: [] });
    }

    if (author) {
      if (!mongoose.isValidObjectId(author)) {
        throw new APIError('Invalid author ID', 400);
      }
      filter.author = sanitize(author, { allowedTags: [] });
    }

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    if (tag) {
      filter.tags = { $in: [sanitize(tag, { allowedTags: [] })] };
    }

    const pageNum = Number(page);
    const skip = (pageNum - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [newsList, total] = await Promise.all([
      News.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name slug')
        .select('-__v -comments')
        .skip(skip)
        .limit(Number(limit))
        .sort(sort)
        .lean(),
      News.countDocuments(filter)
    ]);

    return res.status(200).json({
      news: newsList,
      pagination: {
        total,
        page: pageNum,
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get all news error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get a single news article by MongoDB ObjectId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid news ID format', 400);
    }

    const newsItem = await News.findOne({ _id: id, isActive: true })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .select('-__v -comments')
      .lean();

    if (!newsItem) {
      throw new APIError('News article not found', 404);
    }

    return res.status(200).json({ news: newsItem });
  } catch (error) {
    logger.error('Get news by ID error:', { error: error.message, newsId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get single news article by slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      throw new APIError('Slug is required', 400);
    }

    const sanitizedSlug = sanitize(slug, { allowedTags: [] });
    const news = await News.findOne({ slug: sanitizedSlug, isPublished: true, isActive: true })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .select('-__v -comments')
      .lean();

    if (!news) {
      throw new APIError('News not found', 404);
    }

    return res.status(200).json({ news });
  } catch (error) {
    logger.error('Get news by slug error:', { error: error.message, slug: req.params.slug });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Update news by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateNewsById = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    const { title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid news ID', 400);
    }

    if (title || content || summary || author || category || tags || publishedAt || isPublished !== undefined || thumbnail || featuredImage || videoUrl || seoTitle || seoDescription || readingTime || isFeatured !== undefined || isBreaking !== undefined) {
      validateNewsFields({ title, content, summary, author, category, tags, publishedAt, isPublished, thumbnail, featuredImage, videoUrl, seoTitle, seoDescription, readingTime, isFeatured, isBreaking });
    }

    const sanitizedData = {
      title: title ? sanitize(title, { allowedTags: [] }) : undefined,
      content: content ? sanitize(content, { allowedTags: ['p', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li'] }) : undefined,
      summary: summary ? sanitize(summary, { allowedTags: [] }) : undefined,
      author: author ? sanitize(author, { allowedTags: [] }) : undefined,
      category: category ? sanitize(category, { allowedTags: [] }) : undefined,
      tags: tags ? tags.map(t => sanitize(t, { allowedTags: [] })) : undefined,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      isPublished,
      thumbnail,
      featuredImage,
      videoUrl,
      seoTitle: seoTitle ? sanitize(seoTitle, { allowedTags: [] }) : undefined,
      seoDescription: seoDescription ? sanitize(seoDescription, { allowedTags: [] }) : undefined,
      readingTime,
      isFeatured,
      isBreaking
    };

    /*if (sanitizedData.author) {
      const authorDoc = await User.findOne({ _id: sanitizedData.author, isActive: true });
      if (!authorDoc) {
        throw new APIError('Active author not found', 404);
      }
    }*/

    if (sanitizedData.category) {
      const categoryDoc = await Category.findOne({ _id: sanitizedData.category, isActive: true });
      if (!categoryDoc) {
        throw new APIError('Active category not found', 404);
      }
    }

    let uploadedThumbnail = sanitizedData.thumbnail;
    let uploadedFeaturedImage = sanitizedData.featuredImage;
    let uploadedVideoUrl = sanitizedData.videoUrl;

    if (req.file) {
      try {
        const uploaded = await uploadMedia(req.file, 'news/thumbnails');
        uploadedThumbnail = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload thumbnail', 500);
      }
    } else if (sanitizedData.thumbnail?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.thumbnail, 'news/thumbnails');
        uploadedThumbnail = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload thumbnail', 500);
      }
    }

    if (sanitizedData.featuredImage?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.featuredImage, 'news/featured');
        uploadedFeaturedImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload featured image', 500);
      }
    }

    if (sanitizedData.videoUrl?.startsWith('data:video/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.videoUrl, 'news/videos', 'video');
        uploadedVideoUrl = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload video', 500);
      }
    }

    const updates = Object.fromEntries(
      Object.entries({
        ...sanitizedData,
        thumbnail: uploadedThumbnail,
        featuredImage: uploadedFeaturedImage,
        videoUrl: uploadedVideoUrl
      }).filter(([_, v]) => v !== undefined)
    );

    const updatedNews = await News.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    )
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .select('-__v -comments');

    if (!updatedNews) {
      throw new APIError('News not found', 404);
    }

    logger.info({
      message: 'News updated',
      newsId: id,
      title: sanitizedData.title || updatedNews.title,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'News updated successfully', news: updatedNews });
  } catch (error) {
    logger.error('Update news error:', { error: error.message, newsId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Delete news by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteNewsById = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid news ID', 400);
    }

    const deletedNews = await News.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedNews) {
      throw new APIError('News not found', 404);
    }

    logger.info({
      message: 'News deleted',
      newsId: id,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    logger.error('Delete news error:', { error: error.message, newsId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Increment views count for a news article
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid news ID', 400);
    }

    const updatedNews = await News.findOneAndUpdate(
      { _id: id, isActive: true },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!updatedNews) {
      throw new APIError('News not found', 404);
    }

    logger.info({
      message: 'News views incremented',
      newsId: id,
      viewsCount: updatedNews.viewsCount
    });

    return res.status(200).json({ message: 'View count incremented', viewsCount: updatedNews.viewsCount });
  } catch (error) {
    logger.error('Increment views error:', { error: error.message, newsId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get featured news
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFeaturedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const featuredNews = await News.find({ isFeatured: true, isPublished: true, isActive: true })
      .populate('author', 'name')
      .select('-__v -comments')
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.status(200).json({ news: featuredNews });
  } catch (error) {
    logger.error('Get featured news error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get breaking news
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBreakingNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const breakingNews = await News.find({ isBreaking: true, isPublished: true, isActive: true })
      .populate('author', 'name')
      .select('-__v -comments')
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.status(200).json({ news: breakingNews });
  } catch (error) {
    logger.error('Get breaking news error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Search news
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchNews = async (req, res) => {
  try {
    const { query, page = 1, limit = ITEMS_PER_PAGE } = req.query;
    if (!query || typeof query !== 'string') {
      throw new APIError('Search query is required', 400);
    }

    const sanitizedQuery = sanitize(query, { allowedTags: [] });
    const searchRegex = new RegExp(sanitizedQuery, 'i');
    const filters = {
      isPublished: true,
      isActive: true,
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ]
    };

    const pageNum = Number(page);
    const skip = (pageNum - 1) * Number(limit);

    const [newsList, total] = await Promise.all([
      News.find(filters)
        .populate('author', 'name')
        .select('-__v -comments')
        .skip(skip)
        .limit(Number(limit))
        .sort({ publishedAt: -1 })
        .lean(),
      News.countDocuments(filters)
    ]);

    return res.status(200).json({
      news: newsList,
      pagination: {
        total,
        page: pageNum,
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Search news error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get news by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = ITEMS_PER_PAGE } = req.query;

    if (!category) {
      throw new APIError('Category slug or ID is required', 400);
    }

    const isObjectId = mongoose.isValidObjectId(category);
    const categoryDoc = await Category.findOne(
      isObjectId ? { _id: category, isActive: true } : { slug: sanitize(category, { allowedTags: [] }), isActive: true }
    );

    if (!categoryDoc) {
      throw new APIError('Category not found', 404);
    }

    const filters = {
      category: categoryDoc._id,
      isPublished: true,
      isActive: true
    };

    const pageNum = Number(page);
    const skip = (pageNum - 1) * Number(limit);

    const [newsList, total] = await Promise.all([
      News.find(filters)
        .populate('author', 'name')
        .populate('category', 'name slug')
        .select('-__v -comments')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      News.countDocuments(filters)
    ]);

    return res.status(200).json({
      category: categoryDoc.name,
      news: newsList,
      pagination: {
        total,
        page: pageNum,
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get news by category error:', { error: error.message, category: req.params.category, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get recent news
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRecentNews = async (req, res) => {
  try {
    const { limit = ITEMS_PER_PAGE } = req.query;
    const recentNews = await News.find({ isPublished: true, isActive: true })
      .populate('author', 'name')
      .select('-__v -comments')
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .lean();

    return res.status(200).json({ news: recentNews });
  } catch (error) {
    logger.error('Get recent news error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Get news statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNewsStats = async (req, res) => {
  try {
    console.log('User object in stats route:', req.user); // debug line

    checkAdminPermissions(req.user);

    const [totalNews, publishedNews] = await Promise.all([
      News.countDocuments({ isActive: true }),
      News.countDocuments({ isPublished: true, isActive: true })
    ]);

    return res.status(200).json({
      totalNews,
      publishedNews,
      unpublishedNews: totalNews - publishedNews
    });
  } catch (error) {
    logger.error('Get news stats error:', { error: error.message, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};


/**
 * Toggle breaking news status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleBreakingNews = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid news ID', 400);
    }

    const news = await News.findOne({ _id: id, isActive: true });
    if (!news) {
      throw new APIError('News not found', 404);
    }

    news.isBreaking = !news.isBreaking;
    news.updatedBy = req.user?.id;
    const updatedNews = await news.save();

    logger.info({
      message: `News breaking status toggled to ${news.isBreaking}`,
      newsId: id,
      userId: req.user?.id
    });

    return res.status(200).json({
      message: `News has been ${updatedNews.isBreaking ? 'marked' : 'unmarked'} as breaking`,
      news: updatedNews
    });
  } catch (error) {
    logger.error('Toggle breaking news error:', { error: error.message, newsId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};