import mongoose from 'mongoose'
import Episode from '../models/Episode.js'
import Podcast from '../models/Podcast.js'
import User, { UserRole } from '../models/User.js'
import { uploadMedia } from '../utils/uploadMedia.js'
import sanitize from 'sanitize-html'
import logger from '../utils/logger.js'

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const ITEMS_PER_PAGE = 20

// Check permissions for admin or manager actions
const checkAdminPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError(
      'Unauthorized: Only admins or managers can perform this action',
      403
    )
  }
}

// Validate episode data
const validateEpisodeData = ({
  title,
  description,
  duration,
  episodeNumber,
  tags,
  audioUrl,
}) => {
  if (
    !title ||
    typeof title !== 'string' ||
    title.length < 1 ||
    title.length > 200
  ) {
    throw new APIError('Title is required and must be 1-200 characters', 400)
  }
  if (
    !description ||
    typeof description !== 'string' ||
    description.length < 1
  ) {
    throw new APIError('Description is required', 400)
  }
  /*if (typeof duration !== 'number' || duration <= 0) {
    throw new APIError('Duration must be a positive number', 400);
  }
  if (episodeNumber !== undefined && (typeof episodeNumber !== 'number' || episodeNumber <= 0)) {
    throw new APIError('Episode number must be a positive number', 400);
  }
  if (tags && (!Array.isArray(tags) || tags.some(t => typeof t !== 'string'))) {
    throw new APIError('Tags must be an array of strings', 400);
  }*/
  if (
    audioUrl &&
    !audioUrl.startsWith('data:audio/') &&
    !audioUrl.startsWith('http')
  ) {
    throw new APIError('Invalid audio URL format', 400)
  }
}

/**
 * Add a new episode to a podcast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addEpisode = async (req, res) => {
  try {
    checkAdminPermissions(req.user);
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { podcastId } = req.params;
    const { title, description, duration, episodeNumber, tags } = req.body;

    if (!mongoose.isValidObjectId(podcastId)) {
      throw new APIError('Invalid podcast ID', 400);
    }

    validateEpisodeData({ title, description, duration, episodeNumber, tags });

    const sanitizedData = {
      title: sanitize(title, { allowedTags: [] }),
      description: sanitize(description, { allowedTags: ['p', 'strong', 'em'] }),
      duration: Number(duration),
      episodeNumber: Number(episodeNumber),
      tags: Array.isArray(tags)
        ? tags.map((t) => sanitize(t, { allowedTags: [] }))
        : [],
    };

    const podcast = await Podcast.findOne({ _id: podcastId, isActive: true });
    if (!podcast) {
      throw new APIError('Active podcast not found', 404);
    }

    let uploadedAudioUrl = null;

    if (req.file) {
      // Multer file upload
      const uploaded = await uploadMedia(req.file, 'podcasts/episodes', 'video');
      uploadedAudioUrl = uploaded.secure_url;
    } else if (req.body.audioUrl?.startsWith('data:audio/')) {
      // Base64 upload
      const uploaded = await uploadMedia(req.body.audioUrl, 'podcasts/episodes', 'video');
      uploadedAudioUrl = uploaded.secure_url;
    } else if (req.body.audioUrl) {
      // Already a remote URL
      uploadedAudioUrl = req.body.audioUrl;
    }

    if (!uploadedAudioUrl) {
      throw new APIError('Audio file is required', 400);
    }

    const episode = await Episode.create({
      ...sanitizedData,
      audioUrl: uploadedAudioUrl,
      podcast: podcast._id,
      createdBy: req.user.id,
      isActive: true,
    });

    podcast.episodes.push(episode._id);
    await podcast.save();

    const populatedEpisode = await Episode.findById(episode._id)
      .populate('createdBy', 'name')
      .select('-__v')
      .lean();

    logger.info({
      message: 'Episode created',
      episodeId: episode._id,
      podcastId: podcast._id,
      title: sanitizedData.title,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Episode created successfully',
      episode: populatedEpisode,
    });
  } catch (error) {
    logger.error('Add episode error:', {
      error: error.message,
      body: req.body,
      podcastId: req.params.podcastId,
      userId: req.user?.id,
    });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Update an episode
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateEpisode = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { podcastId, episodeId } = req.params;
    const { title, description, duration, episodeNumber, tags, audioUrl } = req.body;

    if (!mongoose.isValidObjectId(podcastId)) {
      throw new APIError('Invalid podcast ID', 400);
    }
    if (!mongoose.isValidObjectId(episodeId)) {
      throw new APIError('Invalid episode ID', 400);
    }

    if (title || description || duration || episodeNumber !== undefined || tags || audioUrl) {
      validateEpisodeData({ title, description, duration, episodeNumber, tags, audioUrl });
    }

    const podcast = await Podcast.findOne({ _id: podcastId, isActive: true });
    if (!podcast) {
      throw new APIError('Active podcast not found', 404);
    }

    const episode = await Episode.findOne({
      _id: episodeId,
      podcast: podcastId,
      isActive: true,
    });
    if (!episode) {
      throw new APIError('Active episode not found', 404);
    }

    const sanitizedData = {
      title: title ? sanitize(title, { allowedTags: [] }) : undefined,
      description: description
        ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] })
        : undefined,
      duration,
      episodeNumber,
      tags: tags ? tags.map((t) => sanitize(t, { allowedTags: [] })) : undefined,
      audioUrl,
    };

    let uploadedAudioUrl = sanitizedData.audioUrl;

    if (req.file) {
      // Multer file upload
      const uploaded = await uploadMedia(req.file, 'podcasts/episodes', 'video');
      uploadedAudioUrl = uploaded.secure_url;
    } else if (sanitizedData.audioUrl?.startsWith('data:audio/')) {
      // Base64 upload
      const uploaded = await uploadMedia(sanitizedData.audioUrl, 'podcasts/episodes', 'video');
      uploadedAudioUrl = uploaded.secure_url;
    }

    const updates = Object.fromEntries(
      Object.entries({
        ...sanitizedData,
        audioUrl: uploadedAudioUrl || episode.audioUrl,
      }).filter(([_, v]) => v !== undefined)
    );

    const updatedEpisode = await Episode.findOneAndUpdate(
      { _id: episodeId, podcast: podcastId, isActive: true },
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name')
      .select('-__v');

    if (!updatedEpisode) {
      throw new APIError('Episode not found', 404);
    }

    logger.info({
      message: 'Episode updated',
      episodeId: updatedEpisode._id,
      podcastId: podcast._id,
      title: sanitizedData.title || updatedEpisode.title,
      userId: req.user?.id,
    });

    return res.status(200).json({
      message: 'Episode updated successfully',
      episode: updatedEpisode,
    });
  } catch (error) {
    logger.error('Update episode error:', {
      error: error.message,
      podcastId: req.params.podcastId,
      episodeId: req.params.episodeId,
      userId: req.user?.id,
    });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal Server Error' });
  }
};

/**
 * Delete an episode
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteEpisode = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { podcastId, episodeId } = req.params
    if (!mongoose.isValidObjectId(podcastId)) {
      throw new APIError('Invalid podcast ID', 400)
    }
    if (!mongoose.isValidObjectId(episodeId)) {
      throw new APIError('Invalid episode ID', 400)
    }

    const podcast = await Podcast.findOne({ _id: podcastId, isActive: true })
    if (!podcast) {
      throw new APIError('Active podcast not found', 404)
    }

    const episode = await Episode.findOne({
      _id: episodeId,
      podcast: podcastId,
      isActive: true,
    })
    if (!episode) {
      throw new APIError('Active episode not found', 404)
    }

    await Episode.findByIdAndUpdate(episodeId, {
      isActive: false,
      deletedBy: req.user?.id,
      deletedAt: new Date(),
    })

    podcast.episodes = podcast.episodes.filter(
      (id) => id.toString() !== episodeId
    )
    await podcast.save()

    logger.info({
      message: 'Episode deleted',
      episodeId,
      podcastId,
      userId: req.user?.id,
    })

    return res.status(200).json({ message: 'Episode deleted successfully' })
  } catch (error) {
    logger.error('Delete episode error:', {
      error: error.message,
      podcastId: req.params.podcastId,
      episodeId: req.params.episodeId,
      userId: req.user?.id,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Internal Server Error' })
  }
}

/**
 * Get all episodes for a podcast
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllEpisodes = async (req, res) => {
  try {
    const { podcastId } = req.params
    const {
      page = 1,
      limit = ITEMS_PER_PAGE,
      search,
      sortBy = 'publishedDate',
      sortOrder = 'desc',
    } = req.query

    if (!mongoose.isValidObjectId(podcastId)) {
      throw new APIError('Invalid podcast ID', 400)
    }

    const query = { podcast: podcastId, isActive: true }
    if (search) {
      query.title = {
        $regex: sanitize(search, { allowedTags: [] }),
        $options: 'i',
      }
    }

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

    const [episodes, total] = await Promise.all([
      Episode.find(query)
        .select(
          'title description audioUrl duration publishedDate isActive episodeNumber tags'
        )
        .populate('createdBy', 'name')
        .skip(skip)
        .limit(limitNum)
        .sort(sort)
        .lean(),
      Episode.countDocuments(query),
    ])

    return res.status(200).json({
      episodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    logger.error('Get all episodes error:', {
      error: error.message,
      podcastId: req.params.podcastId,
      query: req.query,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Internal Server Error' })
  }
}

/**
 * Get a single episode by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getEpisodeById = async (req, res) => {
  try {
    const { podcastId, episodeId } = req.params

    if (!mongoose.isValidObjectId(podcastId)) {
      throw new APIError('Invalid podcast ID', 400)
    }
    if (!mongoose.isValidObjectId(episodeId)) {
      throw new APIError('Invalid episode ID', 400)
    }

    const episode = await Episode.findOne({
      _id: episodeId,
      podcast: podcastId,
      isActive: true,
    })
      .select(
        'title description audioUrl duration publishedDate isActive episodeNumber tags'
      )
      .populate('createdBy', 'name')
      .lean()

    if (!episode) {
      throw new APIError('Episode not found', 404)
    }

    return res.status(200).json({ episode })
  } catch (error) {
    logger.error('Get episode error:', {
      error: error.message,
      podcastId: req.params.podcastId,
      episodeId: req.params.episodeId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Internal Server Error' })
  }
}
