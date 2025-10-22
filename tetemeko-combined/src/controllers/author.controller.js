import { Author } from '../models/Author.js';
import sanitize from 'sanitize-html';

// Custom error class for better error handling
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Create a new author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAuthor = async (req, res) => {
    try {
        const { name, email, bio, avatar } = req.body;

        // Input validation
        if (!name || !email) {
            throw new APIError('Name and email are required', 400);
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitize(name, { allowedTags: [] }),
            email: sanitize(email, { allowedTags: [] }),
            bio: bio ? sanitize(bio, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
            avatar: avatar ? sanitize(avatar, { allowedTags: [] }) : undefined
        };

        const existing = await Author.findOne({ email: sanitizedData.email });
        if (existing) {
            throw new APIError('Author with this email already exists', 400);
        }

        const newAuthor = await Author.create({
            ...sanitizedData,
            role: 'author'
        });

        return res.status(201).json({ message: 'Author created successfully', author: newAuthor });
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error creating author';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Get all authors with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllAuthors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [authors, total] = await Promise.all([
            Author.find().skip(skip).limit(limit),
            Author.countDocuments()
        ]);

        return res.status(200).json({
            authors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching authors', error: error.message });
    }
};

/**
 * Get author by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            throw new APIError('Author not found', 404);
        }
        return res.status(200).json(author);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error fetching author';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Update author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateAuthor = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;

        // Input validation
        if (!name && !bio && !avatar) {
            throw new APIError('At least one field (name, bio, or avatar) is required', 400);
        }

        // Sanitize inputs
        const sanitizedData = {
            name: name ? sanitize(name, { allowedTags: [] }) : undefined,
            bio: bio ? sanitize(bio, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
            avatar: avatar ? sanitize(avatar, { allowedTags: [] }) : undefined
        };

        const updated = await Author.findByIdAndUpdate(
            req.params.id,
            { ...sanitizedData },
            { new: true, runValidators: true }
        );

        if (!updated) {
            throw new APIError('Author not found', 404);
        }

        return res.status(200).json({ message: 'Author updated successfully', author: updated });
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error updating author';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Delete author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteAuthor = async (req, res) => {
    try {
        const deleted = await Author.findByIdAndDelete(req.params.id);
        if (!deleted) {
            throw new APIError('Author not found', 404);
        }
        return res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error deleting author';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Verify author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        if (!author) {
            throw new APIError('Author not found', 404);
        }
        return res.status(200).json({ message: 'Author verified successfully', author });
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error verifying author';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Get current author profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCurrentAuthorProfile = async (req, res) => {
    try {
        const author = await Author.findById(req.user?.id);
        if (!author) {
            throw new APIError('Author not found', 404);
        }
        return res.status(200).json(author);
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error fetching profile';
        return res.status(status).json({ message, error: error.message });
    }
};

/**
 * Search authors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchAuthors = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;

        if (!query || typeof query !== 'string' || !query.trim()) {
            throw new APIError('Valid query parameter is required', 400);
        }

        const sanitizedQuery = sanitize(query.trim(), { allowedTags: [] });
        const regex = new RegExp(sanitizedQuery, 'i');
        const skip = (Number(page) - 1) * Number(limit);

        const [authors, total] = await Promise.all([
            Author.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { bio: regex }
                ]
            }).skip(skip).limit(Number(limit)),
            Author.countDocuments({
                $or: [
                    { name: regex },
                    { email: regex },
                    { bio: regex }
                ]
            })
        ]);

        return res.status(200).json({
            authors,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Error searching authors';
        return res.status(status).json({ message, error: error.message });
    }
};