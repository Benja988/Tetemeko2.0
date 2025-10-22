import mongoose from 'mongoose'
import User, { UserRole } from '../models/User.js'
import crypto from 'crypto'
import sanitize from 'sanitize-html'
import { sendEmail } from '../utils/sendEmail.js'

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

// Check permissions for admin-only actions
const checkAdminPermissions = (user) => {
  if (!user || user.role !== UserRole.ADMIN) {
    throw new APIError('Unauthorized: Only admins can perform this action', 403)
  }
}

const ITEMS_PER_PAGE = 20

/**
 * Get paginated list of users (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUsers = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const {
      page = 1,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query
    const query = role ? { role: sanitize(role, { allowedTags: [] }) } : {}

    const skip = (Number(page) - 1) * ITEMS_PER_PAGE
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select(
          '-password -refreshToken -resetPasswordToken -verificationToken'
        )
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      User.countDocuments(query),
    ])

    return res.status(200).json({
      data: users,
      page: Number(page),
      totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
      totalUsers,
    })
  } catch (error) {
    console.error('Get users error:', {
      error: error.message,
      query: req.query,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to fetch users' })
  }
}

/**
 * Get single user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const user = await User.findById(userId)
      .select('-password -refreshToken -resetPasswordToken -verificationToken')
      .lean()

    if (!user) {
      throw new APIError('User not found', 404)
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Get user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to fetch user' })
  }
}

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    const { name, email, role, isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    if (!name && !email && !role && isActive === undefined) {
      throw new APIError('At least one field is required for update', 400)
    }

    if (role && !Object.values(UserRole).includes(role)) {
      throw new APIError('Invalid user role', 400)
    }

    const sanitizedData = {
      name: name ? sanitize(name, { allowedTags: [] }) : undefined,
      email: email
        ? sanitize(email, { allowedTags: [] }).toLowerCase()
        : undefined,
      role,
      isActive,
    }

    const updateData = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
    )

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken -verificationToken')

    if (!updatedUser) {
      throw new APIError('User not found', 404)
    }

    // Send notification email for significant changes
    if (role || isActive !== undefined) {
      await sendEmail(updatedUser.email, 'Account Updated', {
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
        <h2>Account Update Notification</h2>
        <p>Hello ${updatedUser.name},</p>
        <p>Your account has been updated by an administrator.</p>
        ${role ? `<p>New role: ${role}</p>` : ''}
        ${
          isActive !== undefined
            ? `<p>Account status: ${isActive ? 'Active' : 'Deactivated'}</p>`
            : ''
        }
      </div>
    `,
        text: `Hello ${
          updatedUser.name
        },\n\nYour account has been updated by an administrator.${
          role ? `\nNew role: ${role}` : ''
        }${
          isActive !== undefined
            ? `\nAccount status: ${isActive ? 'Active' : 'Deactivated'}`
            : ''
        }`,
      })
    }

    return res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Update user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to update user' })
  }
}

/**
 * Delete user (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    )

    if (!deletedUser) {
      throw new APIError('User not found', 404)
    }

    await sendEmail(
      deletedUser.email,
      'Account Deactivated',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Account Deactivation Notification</h2>
          <p>Hello ${deletedUser.name},</p>
          <p>Your account has been deactivated by an administrator.</p>
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      `
    )

    return res.status(200).json({ message: 'User deactivated successfully' })
  } catch (error) {
    console.error('Delete user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to deactivate user' })
  }
}

/**
 * Delete multiple users (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUsers = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userIds } = req.body
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new APIError('No user IDs provided', 400)
    }

    const invalidIds = userIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    )
    if (invalidIds.length > 0) {
      throw new APIError('Some user IDs are invalid', 400)
    }

    const result = await User.updateMany(
      { _id: { $in: userIds }, isActive: true },
      {
        $set: {
          isActive: false,
          deletedBy: req.user?.id,
          deletedAt: new Date(),
        },
      }
    )

    // Notify affected users
    const users = await User.find({ _id: { $in: userIds } })
    await Promise.all(
      users.map((user) =>
        sendEmail(
          user.email,
          'Account Deactivated',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
            <h2>Account Deactivation Notification</h2>
            <p>Hello ${user.name},</p>
            <p>Your account has been deactivated by an administrator.</p>
            <p>If you believe this is an error, please contact our support team.</p>
          </div>
        `
        )
      )
    )

    return res.status(200).json({
      message: `${result.modifiedCount} user(s) deactivated successfully`,
    })
  } catch (error) {
    console.error('Delete users error:', {
      error: error.message,
      userIds: req.body.userIds,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to deactivate users' })
  }
}

/**
 * Lock user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const lockUser = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const lockUntil = new Date(Date.now() + 15 * 60 * 1000)
    const user = await User.findByIdAndUpdate(
      userId,
      { lockUntil, failedLoginAttempts: 5, updatedBy: req.user?.id },
      { new: true }
    )

    if (!user) {
      throw new APIError('User not found', 404)
    }

    await sendEmail(
      user.email,
      'Account Locked',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Account Lock Notification</h2>
          <p>Hello ${user.name},</p>
          <p>Your account has been temporarily locked by an administrator.</p>
          <p>The lock will expire on ${lockUntil.toLocaleString()}.</p>
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      `
    )

    return res.status(200).json({ message: 'User account locked' })
  } catch (error) {
    console.error('Lock user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to lock user' })
  }
}

/**
 * Unlock user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const unlockUser = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const user = await User.findById(userId)
    if (!user) {
      throw new APIError('User not found', 404)
    }

    await user.resetFailedLogins()

    await sendEmail(
      user.email,
      'Account Unlocked',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Account Unlock Notification</h2>
          <p>Hello ${user.name},</p>
          <p>Your account has been unlocked by an administrator.</p>
          <p>You can now log in to your account.</p>
        </div>
      `
    )

    return res.status(200).json({ message: 'User account unlocked' })
  } catch (error) {
    console.error('Unlock user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to unlock user' })
  }
}

/**
 * Admin-initiated password reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const adminResetPassword = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const user = await User.findById(userId)
    if (!user) {
      throw new APIError('User not found', 404)
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    await sendEmail(
      user.email,
      'Password Reset Request',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>An administrator has initiated a password reset for your account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>Or copy and paste this link: ${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
    )

    return res
      .status(200)
      .json({ message: 'Password reset email sent successfully' })
  } catch (error) {
    console.error('Admin reset password error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to generate reset token' })
  }
}

/**
 * Search users by email or name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchUsers = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { query, page = 1, limit = 50 } = req.query
    if (!query || typeof query !== 'string' || !query.trim()) {
      throw new APIError('Valid query parameter required', 400)
    }

    const sanitizedQuery = sanitize(query.trim(), { allowedTags: [] })
    const regex = new RegExp(sanitizedQuery, 'i')
    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
      User.find({
        $or: [{ email: regex }, { name: regex }],
        isActive: true,
      })
        .select(
          '-password -refreshToken -resetPasswordToken -verificationToken'
        )
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments({
        $or: [{ email: regex }, { name: regex }],
        isActive: true,
      }),
    ])

    return res.status(200).json({
      results: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error('Search users error:', {
      error: error.message,
      query: req.query.query,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Search failed' })
  }
}

/**
 * Reactivate a deactivated user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const reactivateUser = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true, updatedBy: req.user?.id },
      { new: true }
    ).select('-password -refreshToken -resetPasswordToken -verificationToken')

    if (!user) {
      throw new APIError('User not found', 404)
    }

    await sendEmail(
      user.email,
      'Account Reactivated',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Account Reactivation Notification</h2>
          <p>Hello ${user.name},</p>
          <p>Your account has been reactivated by an administrator.</p>
          <p>You can now log in to your account.</p>
        </div>
      `
    )

    return res.status(200).json({ message: 'User account reactivated', user })
  } catch (error) {
    console.error('Reactivate user error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to reactivate user' })
  }
}

/**
 * Promote a user to Manager role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const promoteToManager = async (req, res) => {
  try {
    checkAdminPermissions(req.user)

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid user ID', 400)
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: UserRole.MANAGER, updatedBy: req.user?.id },
      { new: true }
    ).select('-password -refreshToken -resetPasswordToken -verificationToken')

    if (!user) {
      throw new APIError('User not found', 404)
    }

    await sendEmail(
      user.email,
      'Role Updated',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Role Update Notification</h2>
          <p>Hello ${user.name},</p>
          <p>You have been promoted to Manager role by an administrator.</p>
          <p>You now have additional permissions in the system.</p>
        </div>
      `
    )

    return res.status(200).json({ message: 'User promoted to Manager', user })
  } catch (error) {
    console.error('Promote to manager error:', {
      error: error.message,
      userId: req.params.userId,
    })
    const status = error.statusCode || 500
    return res
      .status(status)
      .json({ message: error.message || 'Failed to promote user' })
  }
}
