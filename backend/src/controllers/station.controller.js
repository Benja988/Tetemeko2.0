import mongoose from 'mongoose'
import Station from '../models/Station.js'
import { uploadMedia } from '../utils/uploadMedia.js'
import sanitize from 'sanitize-html'
import { UserRole } from '../models/User.js'

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'APIError'
  }
}

// Predefined valid station types and genres
const VALID_STATION_TYPES = ['Radio Station', 'TV Station']
const VALID_GENRES = [
  'pop',
  'rock',
  'jazz',
  'classical',
  'news',
  'sports',
  'talk',
  'hip-hop',
  'country',
]
const ITEMS_PER_PAGE = 20

// Check permissions for admin-only actions
const checkAdminPermissions = (user) => {
  if (!user || user.role !== UserRole.ADMIN) {
    throw new APIError('Unauthorized: Only admins can perform this action', 403)
  }
}

// Check database connection before queries
const checkDbConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    // 1 = connected
    throw new APIError('Database connection error', 500)
  }
}

/**
 * Get all stations with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllStations = async (req, res) => {
  try {
    checkDbConnection()
    const { page = 1, type, genre, isActive } = req.query
    const filter = {}

    if (type) {
      const sanitizedType = sanitize(type, { allowedTags: [] })
      if (!VALID_STATION_TYPES.includes(sanitizedType)) {
        throw new APIError(
          `Invalid station type. Must be one of: ${VALID_STATION_TYPES.join(
            ', '
          )}`,
          400
        )
      }
      filter.type = sanitizedType
    }

    if (genre) {
      const sanitizedGenre = sanitize(genre, { allowedTags: [] })
      if (!VALID_GENRES.includes(sanitizedGenre)) {
        throw new APIError(
          `Invalid genre. Must be one of: ${VALID_GENRES.join(', ')}`,
          400
        )
      }
      filter.genre = sanitizedGenre
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    const skip = (Number(page) - 1) * ITEMS_PER_PAGE
    const [stations, total] = await Promise.all([
      Station.find(filter)
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 })
        .lean(),
      Station.countDocuments(filter),
    ])

    return res.status(200).json({
      stations,
      pagination: {
        page: Number(page),
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE),
      },
    })
  } catch (error) {
    console.error('Get stations error:', {
      error: error.message,
      query: req.query,
      stack: error.stack,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to retrieve stations' })
  }
}

/**
 * Get a single station by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getStationById = async (req, res) => {
  try {
    checkDbConnection()
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid station ID', 400)
    }

    const station = await Station.findById(id).select('-__v').lean()
    if (!station) {
      throw new APIError('Station not found', 404)
    }

    return res.status(200).json(station)
  } catch (error) {
    console.error('Get station error:', {
      error: error.message,
      stationId: req.params.id,
      stack: error.stack,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to fetch station' })
  }
}

/**
 * Create a new station
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createStation = async (req, res) => {
  try {
    checkAdminPermissions(req.user);
    checkDbConnection();

    let {
      name,
      description,
      streamUrl,
      imageUrl,
      location,
      genre,
      isActive,
      type,
      liveShow,
      listenerz,
    } = req.body;

    // Required fields
    if (!name || !location || !type) {
      throw new APIError('Missing required fields: name, location, type', 400);
    }

    // Normalize and validate type (case-insensitive match)
    const matchedType = VALID_STATION_TYPES.find(
      t => t.toLowerCase() === type.toLowerCase()
    );
    if (!matchedType) {
      throw new APIError(
        `Invalid station type. Must be one of: ${VALID_STATION_TYPES.join(', ')}`,
        400
      );
    }

    // Validate and normalize genres
    let normalizedGenres = [];
    if (genre) {
      if (!Array.isArray(genre)) {
        throw new APIError('Genre must be an array', 400);
      }
      normalizedGenres = genre.map(g => g.toLowerCase());
      if (!normalizedGenres.every(g => VALID_GENRES.includes(g))) {
        throw new APIError(
          `Invalid genres. Must be one of: ${VALID_GENRES.join(', ')}`,
          400
        );
      }
    }

    // Prepare sanitized data
    const sanitizedData = {
      name: sanitize(name, { allowedTags: [] }),
      description: description
        ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] })
        : '',
      streamUrl: streamUrl ? sanitize(streamUrl, { allowedTags: [] }) : '',
      location: sanitize(location, { allowedTags: [] }),
      genre: normalizedGenres,
      isActive: isActive !== undefined ? isActive : true,
      type: matchedType, // ✅ Store proper enum-cased value
      liveShow: liveShow ? sanitize(liveShow, { allowedTags: [] }) : null,
      listenerz: Number(listenerz) || 0,
    };

    // Handle image upload if base64 provided
    let uploadedImageUrl = imageUrl || '';
    if (
      imageUrl &&
      typeof imageUrl === 'string' &&
      imageUrl.startsWith('data:image/')
    ) {
      try {
        const result = await uploadMedia(imageUrl, 'stations', 'image');
        uploadedImageUrl = result.secure_url;
      } catch (uploadError) {
        throw new APIError(`Failed to upload image: ${uploadError.message}`, 500);
      }
    }

    // Create station
    const newStation = await Station.create({
      ...sanitizedData,
      imageUrl: uploadedImageUrl,
      createdBy: req.user?.id,
    });

    return res
      .status(201)
      .json({ message: 'Station created successfully', station: newStation });

  } catch (error) {
    console.error('Create station error:', {
      error: error.message,
      name: req.body.name,
      stack: error.stack,
    });
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json({ message: error.message || 'Failed to create station' });
  }
};

/**
 * Update a station
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateStation = async (req, res) => {
  try {
    checkAdminPermissions(req.user)
    checkDbConnection()

    const { id } = req.params
    const {
      name,
      description,
      streamUrl,
      imageUrl,
      location,
      genre,
      isActive,
      type,
      liveShow,
      listenerz,
    } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid station ID', 400)
    }

    if (type && !VALID_STATION_TYPES.includes(type)) {
      throw new APIError(
        `Invalid station type. Must be one of: ${VALID_STATION_TYPES.join(
          ', '
        )}`,
        400
      )
    }

    if (genre && !Array.isArray(genre)) {
      throw new APIError('Genre must be an array', 400)
    }

    if (genre && !genre.every((g) => VALID_GENRES.includes(g))) {
      throw new APIError(
        `Invalid genres. Must be one of: ${VALID_GENRES.join(', ')}`,
        400
      )
    }

    const sanitizedData = {
      name: name ? sanitize(name, { allowedTags: [] }) : undefined,
      description: description
        ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] })
        : undefined,
      streamUrl: streamUrl
        ? sanitize(streamUrl, { allowedTags: [] })
        : undefined,
      location: location ? sanitize(location, { allowedTags: [] }) : undefined,
      genre: genre || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      type: type ? sanitize(type, { allowedTags: [] }) : undefined,
      liveShow: liveShow ? sanitize(liveShow, { allowedTags: [] }) : undefined,
      listenerz: listenerz !== undefined ? Number(listenerz) : undefined,
    }

    let uploadedImageUrl = imageUrl
    if (
      imageUrl &&
      typeof imageUrl === 'string' &&
      imageUrl.startsWith('data:image/')
    ) {
      try {
        const result = await uploadMedia(imageUrl, 'stations', 'image')
        uploadedImageUrl = result.secure_url
      } catch (uploadError) {
        throw new APIError(
          `Failed to upload image: ${uploadError.message}`,
          500
        )
      }
    }

    const updates = Object.fromEntries(
      Object.entries({ ...sanitizedData, imageUrl: uploadedImageUrl }).filter(
        ([_, v]) => v !== undefined
      )
    )

    const updatedStation = await Station.findByIdAndUpdate(
      id,
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    ).select('-__v')

    if (!updatedStation) {
      throw new APIError('Station not found', 404)
    }

    return res
      .status(200)
      .json({
        message: 'Station updated successfully',
        station: updatedStation,
      })
  } catch (error) {
    console.error('Update station error:', {
      error: error.message,
      stationId: req.params.id,
      stack: error.stack,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to update station' })
  }
}

/**
 * Delete a station (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteStation = async (req, res) => {
  try {
    checkAdminPermissions(req.user)
    checkDbConnection()

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid station ID', 400)
    }

    const deletedStation = await Station.findByIdAndDelete(id)

    if (!deletedStation) {
      throw new APIError('Station not found', 404)
    }

    return res.status(200).json({ message: 'Station permanently deleted successfully' })
  } catch (error) {
    console.error('Delete station error:', {
      error: error.message,
      stationId: req.params.id,
      stack: error.stack,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to delete station' })
  }
}

/**
 * Toggle station active status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const toggleStationStatus = async (req, res) => {
  try {
    checkAdminPermissions(req.user)
    checkDbConnection()

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid station ID', 400)
    }

    const station = await Station.findById(id)
    if (!station) {
      throw new APIError('Station not found', 404)
    }

    station.isActive = !station.isActive
    station.updatedBy = req.user?.id
    await station.save()

    return res.status(200).json({
      message: `Station is now ${station.isActive ? 'active' : 'inactive'}`,
      station,
    })
  } catch (error) {
    console.error('Toggle station status error:', {
      error: error.message,
      stationId: req.params.id,
      stack: error.stack,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to toggle station status' })
  }
}
