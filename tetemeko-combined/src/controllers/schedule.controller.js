import mongoose from 'mongoose';
import Schedule from '../models/Schedule.js';
import Station from '../models/Station.js';
import { User, UserRole } from '../models/User.js';
import { sanitize } from 'sanitize-html';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Predefined valid days of week
const VALID_DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ITEMS_PER_PAGE = 20;

// Check permissions for admin or manager actions
const checkPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate time range
const validateTimeRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new APIError('Invalid date format for startTime or endTime', 400);
  }
  if (start >= end) {
    throw new APIError('startTime must be before endTime', 400);
  }
};

/**
 * Create a new schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createSchedule = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { station, title, host, startTime, endTime, recurring, daysOfWeek } = req.body;

    if (!station || !title || !startTime || !endTime) {
      throw new APIError('Missing required fields: station, title, startTime, endTime', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(station)) {
      throw new APIError('Invalid station ID', 400);
    }

    if (host && !mongoose.Types.ObjectId.isValid(host)) {
      throw new APIError('Invalid host ID', 400);
    }

    const sanitizedData = {
      station: sanitize(station, { allowedTags: [] }),
      title: sanitize(title, { allowedTags: [] }),
      host: host ? sanitize(host, { allowedTags: [] }) : undefined,
      startTime,
      endTime,
      recurring: recurring !== undefined ? Boolean(recurring) : false,
      daysOfWeek: daysOfWeek ? daysOfWeek.map(d => sanitize(d, { allowedTags: [] })) : undefined
    };

    if (sanitizedData.daysOfWeek && !sanitizedData.daysOfWeek.every(day => VALID_DAYS_OF_WEEK.includes(day))) {
      throw new APIError(`Invalid days of week. Must be one of: ${VALID_DAYS_OF_WEEK.join(', ')}`, 400);
    }

    validateTimeRange(sanitizedData.startTime, sanitizedData.endTime);

    // Verify station exists and is active
    const stationDoc = await Station.findOne({ _id: sanitizedData.station, isActive: true });
    if (!stationDoc) {
      throw new APIError('Active station not found', 404);
    }

    // Verify host exists if provided
    if (sanitizedData.host) {
      const hostDoc = await User.findOne({ _id: sanitizedData.host, isActive: true });
      if (!hostDoc) {
        throw new APIError('Active host not found', 404);
      }
    }

    // Check for overlapping schedules
    const overlappingSchedule = await Schedule.findOne({
      station: sanitizedData.station,
      $or: [
        {
          startTime: { $lte: new Date(sanitizedData.endTime) },
          endTime: { $gte: new Date(sanitizedData.startTime) }
        }
      ],
      ...(sanitizedData.daysOfWeek ? { daysOfWeek: { $in: sanitizedData.daysOfWeek } } : {}),
      isActive: true
    });

    if (overlappingSchedule) {
      throw new APIError('Schedule conflicts with an existing schedule', 409);
    }

    const schedule = await Schedule.create({
      ...sanitizedData,
      createdBy: req.user?.id,
      isActive: true
    });

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('station', 'name')
      .populate('host', 'name email')
      .lean();

    return res.status(201).json({ message: 'Schedule created successfully', schedule: populatedSchedule });
  } catch (error) {
    console.error('Create schedule error:', { error: error.message, body: req.body });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to create schedule' });
  }
};

/**
 * Get all schedules with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllSchedules = async (req, res) => {
  try {
    const { page = 1, station, startDate, endDate } = req.query;
    const filter = { isActive: true };

    if (station) {
      if (!mongoose.Types.ObjectId.isValid(station)) {
        throw new APIError('Invalid station ID', 400);
      }
      filter.station = sanitize(station, { allowedTags: [] });
    }

    if (startDate && endDate) {
      validateTimeRange(startDate, endDate);
      filter.startTime = { $gte: new Date(startDate) };
      filter.endTime = { $lte: new Date(endDate) };
    }

    const skip = (Number(page) - 1) * ITEMS_PER_PAGE;
    const [schedules, total] = await Promise.all([
      Schedule.find(filter)
        .populate('station', 'name')
        .populate('host', 'name email')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort({ startTime: 1 })
        .lean(),
      Schedule.countDocuments(filter)
    ]);

    return res.status(200).json({
      schedules,
      pagination: {
        page: Number(page),
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    console.error('Get schedules error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to retrieve schedules' });
  }
};

/**
 * Get schedule by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid schedule ID', 400);
    }

    const schedule = await Schedule.findOne({ _id: id, isActive: true })
      .populate('station', 'name')
      .populate('host', 'name email')
      .select('-__v')
      .lean();

    if (!schedule) {
      throw new APIError('Schedule not found', 404);
    }

    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Get schedule error:', { error: error.message, scheduleId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to fetch schedule' });
  }
};

/**
 * Update a schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateSchedule = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    const { station, title, host, startTime, endTime, recurring, daysOfWeek } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid schedule ID', 400);
    }

    const sanitizedData = {
      station: station ? sanitize(station, { allowedTags: [] }) : undefined,
      title: title ? sanitize(title, { allowedTags: [] }) : undefined,
      host: host ? sanitize(host, { allowedTags: [] }) : undefined,
      startTime,
      endTime,
      recurring: recurring !== undefined ? Boolean(recurring) : undefined,
      daysOfWeek: daysOfWeek ? daysOfWeek.map(d => sanitize(d, { allowedTags: [] })) : undefined
    };

    if (sanitizedData.station && !mongoose.Types.ObjectId.isValid(sanitizedData.station)) {
      throw new APIError('Invalid station ID', 400);
    }

    if (sanitizedData.host && !mongoose.Types.ObjectId.isValid(sanitizedData.host)) {
      throw new APIError('Invalid host ID', 400);
    }

    if (sanitizedData.daysOfWeek && !sanitizedData.daysOfWeek.every(day => VALID_DAYS_OF_WEEK.includes(day))) {
      throw new APIError(`Invalid days of week. Must be one of: ${VALID_DAYS_OF_WEEK.join(', ')}`, 400);
    }

    if (sanitizedData.startTime && sanitizedData.endTime) {
      validateTimeRange(sanitizedData.startTime, sanitizedData.endTime);
    }

    if (sanitizedData.station) {
      const stationDoc = await Station.findOne({ _id: sanitizedData.station, isActive: true });
      if (!stationDoc) {
        throw new APIError('Active station not found', 404);
      }
    }

    if (sanitizedData.host) {
      const hostDoc = await User.findOne({ _id: sanitizedData.host, isActive: true });
      if (!hostDoc) {
        throw new APIError('Active host not found', 404);
      }
    }

    // Check for overlapping schedules
    if (sanitizedData.startTime && sanitizedData.endTime && sanitizedData.station) {
      const overlappingSchedule = await Schedule.findOne({
        _id: { $ne: id },
        station: sanitizedData.station,
        $or: [
          {
            startTime: { $lte: new Date(sanitizedData.endTime) },
            endTime: { $gte: new Date(sanitizedData.startTime) }
          }
        ],
        ...(sanitizedData.daysOfWeek ? { daysOfWeek: { $in: sanitizedData.daysOfWeek } } : {}),
        isActive: true
      });

      if (overlappingSchedule) {
        throw new APIError('Schedule conflicts with an existing schedule', 409);
      }
    }

    const updates = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
    );

    const schedule = await Schedule.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    )
      .populate('station', 'name')
      .populate('host', 'name email')
      .select('-__v');

    if (!schedule) {
      throw new APIError('Schedule not found', 404);
    }

    return res.status(200).json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    console.error('Update schedule error:', { error: error.message, scheduleId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to update schedule' });
  }
};

/**
 * Delete a schedule (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteSchedule = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid schedule ID', 400);
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    );

    if (!schedule) {
      throw new APIError('Schedule not found', 404);
    }

    return res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', { error: error.message, scheduleId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to delete schedule' });
  }
};