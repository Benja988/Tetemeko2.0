import mongoose from 'mongoose';
import Podcast from '../models/Podcast.js';
import Episode from '../models/Episode.js';
import { Category } from '../models/Category.js';
import User, { UserRole } from '../models/User.js';
import Station from '../models/Station.js';
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
const checkPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate podcast data
const validatePodcastData = ({ title, description, category, station, coverImage }, hasFile = false) => {
  if (!description || typeof description !== 'string' || description.length < 1) {
    throw new APIError('Description is required', 400);
  }
  if (!category || !mongoose.isValidObjectId(category)) {
    throw new APIError('Valid category ID is required', 400);
  }
  if (station && !mongoose.isValidObjectId(station)) {
    throw new APIError('Invalid station ID', 400);
  }

  // Only validate coverImage if it's a string and not a file upload
  if (!hasFile && coverImage && !coverImage.startsWith('data:image/') && !coverImage.startsWith('http')) {
    throw new APIError('Invalid cover image format', 400);
  }
};


/**
 * Create a new podcast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPodcast = async (req, res) => {
  try {
    checkPermissions(req.user);
    if (!req.user?.id) {
      throw new APIError('User not authenticated', 401);
    }

    const { title, description, category, station, coverImage } = req.body;

    validatePodcastData({ title, description, category, station, coverImage }, !!req.file);

    const sanitizedData = {
      title: sanitize(title, { allowedTags: [] }),
      description: sanitize(description, { allowedTags: ['p', 'strong', 'em'] }),
      category: sanitize(category, { allowedTags: [] }),
      station: station ? sanitize(station, { allowedTags: [] }) : undefined,
      coverImage
    };

    // Verify category exists and is of type 'podcast'
    const categoryDoc = await Category.findOne({ _id: sanitizedData.category, categoryType: 'podcast', isActive: true });
    if (!categoryDoc) {
      throw new APIError('Invalid or non-podcast category selected', 400);
    }

    // Verify station exists if provided
    if (sanitizedData.station) {
      const stationDoc = await Station.findOne({ _id: sanitizedData.station, isActive: true });
      if (!stationDoc) {
        throw new APIError('Active station not found', 404);
      }
    }

    let uploadedCoverImage = sanitizedData.coverImage;
    if (req.file) {
      try {
        const uploaded = await uploadMedia(req.file, 'podcasts/covers');
        uploadedCoverImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload cover image', 500);
      }
    } else if (sanitizedData.coverImage?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.coverImage, 'podcasts/covers');
        uploadedCoverImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload cover image', 500);
      }
    }

    const podcast = await Podcast.create({
      ...sanitizedData,
      coverImage: uploadedCoverImage || '',
      createdBy: req.user.id,
      isActive: true
    });

    const populatedPodcast = await Podcast.findById(podcast._id)
      .populate('createdBy', 'name')
      .populate('station', 'name')
      .populate('category', 'name')
      .select('-__v')
      .lean();

    logger.info({
      message: 'Podcast created',
      podcastId: podcast._id,
      title: sanitizedData.title,
      userId: req.user.id
    });

    return res.status(201).json({ message: 'Podcast created successfully', podcast: populatedPodcast });
  } catch (error) {
    logger.error('Create podcast error:', { error: error.message, body: req.body, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to create podcast' });
  }
};

/**
 * Get all podcasts with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPodcasts = async (req, res) => {
  try {
    const { category, page = 1, limit = ITEMS_PER_PAGE, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { isActive: true };

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        throw new APIError('Invalid category ID', 400);
      }
      filter.category = sanitize(category, { allowedTags: [] });
    }

    if (search) {
      const sanitizedSearch = sanitize(search, { allowedTags: [] });
      filter.title = { $regex: sanitizedSearch, $options: 'i' };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [podcasts, total] = await Promise.all([
      Podcast.find(filter)
        .select('title description coverImage station category createdBy isActive')
        .populate('createdBy', 'name')
        .populate('station', 'name')
        .populate('category', 'name')
        .skip(skip)
        .limit(limitNum)
        .sort(sort)
        .lean(),
      Podcast.countDocuments(filter)
    ]);

    return res.status(200).json({
      podcasts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Get podcasts error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to fetch podcasts' });
  }
};

/**
 * Get a single podcast by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPodcastById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid podcast ID', 400);
    }

    const podcast = await Podcast.findOne({ _id: id, isActive: true })
      .select('title description coverImage station category createdBy episodes isActive')
      .populate('createdBy', 'name')
      .populate('station', 'name')
      .populate('category', 'name')
      .populate({
        path: 'episodes',
        select: 'title description audioUrl duration publishedDate isActive episodeNumber tags',
        match: { isActive: true }
      })
      .lean();

    if (!podcast) {
      throw new APIError('Podcast not found', 404);
    }

    return res.status(200).json({ podcast });
  } catch (error) {
    logger.error('Get podcast error:', { error: error.message, podcastId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to fetch podcast' });
  }
};

/**
 * Update a podcast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePodcast = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    const { title, description, category, station, coverImage } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid podcast ID', 400);
    }

    // Validate only provided fields
    if (title || description || category || station || coverImage) {
      validatePodcastData({ title, description, category, station, coverImage }, !!req.file);
    }

    const sanitizedData = {
      title: title ? sanitize(title, { allowedTags: [] }) : undefined,
      description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
      category: category ? sanitize(category, { allowedTags: [] }) : undefined,
      station: station ? sanitize(station, { allowedTags: [] }) : undefined,
      coverImage
    };

    if (sanitizedData.category) {
      const categoryDoc = await Category.findOne({ _id: sanitizedData.category, categoryType: 'podcast', isActive: true });
      if (!categoryDoc) {
        throw new APIError('Invalid or non-podcast category selected', 400);
      }
    }

    if (sanitizedData.station) {
      const stationDoc = await Station.findOne({ _id: sanitizedData.station, isActive: true });
      if (!stationDoc) {
        throw new APIError('Active station not found', 404);
      }
    }

    let uploadedCoverImage = sanitizedData.coverImage;
    if (req.file) {
      try {
        const uploaded = await uploadMedia(req.file, 'podcasts/covers');
        uploadedCoverImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload cover image', 500);
      }
    } else if (sanitizedData.coverImage?.startsWith('data:image/')) {
      try {
        const uploaded = await uploadMedia(sanitizedData.coverImage, 'podcasts/covers');
        uploadedCoverImage = uploaded.secure_url;
      } catch (uploadError) {
        throw new APIError('Failed to upload cover image', 500);
      }
    }

    const updates = Object.fromEntries(
      Object.entries({ ...sanitizedData, coverImage: uploadedCoverImage })
        .filter(([_, v]) => v !== undefined)
    );

    const updatedPodcast = await Podcast.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name')
      .populate('station', 'name')
      .populate('category', 'name')
      .select('-__v');

    if (!updatedPodcast) {
      throw new APIError('Podcast not found', 404);
    }

    logger.info({
      message: 'Podcast updated',
      podcastId: updatedPodcast._id,
      title: sanitizedData.title || updatedPodcast.title,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Podcast updated successfully', podcast: updatedPodcast });
  } catch (error) {
    logger.error('Update podcast error:', { error: error.message, podcastId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to update podcast' });
  }
};

/**
 * Delete a podcast (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePodcast = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid podcast ID', 400);
    }

    const podcast = await Podcast.findOne({ _id: id, isActive: true });
    if (!podcast) {
      throw new APIError('Podcast not found', 404);
    }

    // Soft delete podcast and associated episodes
    await Promise.all([
      Podcast.findByIdAndUpdate(id, { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() }),
      Episode.updateMany({ podcast: id, isActive: true }, { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() })
    ]);

    logger.info({
      message: 'Podcast deleted',
      podcastId: id,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Podcast and associated episodes deleted successfully' });
  } catch (error) {
    logger.error('Delete podcast error:', { error: error.message, podcastId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to delete podcast' });
  }
};

/**
 * Toggle podcast active status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const togglePodcastStatus = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid podcast ID', 400);
    }

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      throw new APIError('Podcast not found', 404);
    }

    podcast.isActive = !podcast.isActive;
    podcast.updatedBy = req.user?.id;
    const updatedPodcast = await podcast.save();

    logger.info({
      message: `Podcast status toggled to ${podcast.isActive}`,
      podcastId: id,
      userId: req.user?.id
    });

    return res.status(200).json({
      message: `Podcast is now ${updatedPodcast.isActive ? 'active' : 'inactive'}`,
      podcast: updatedPodcast
    });
  } catch (error) {
    logger.error('Toggle podcast status error:', { error: error.message, podcastId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to toggle podcast status' });
  }
};