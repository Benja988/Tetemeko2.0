import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';
import { config } from 'dotenv';
import sanitize from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

const UPLOAD_CONFIG = {
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB
  maxRetries: Number(process.env.UPLOAD_MAX_RETRIES) || 3,
  retryDelay: Number(process.env.UPLOAD_RETRY_DELAY) || 1000,
  defaultFolder: process.env.UPLOAD_DEFAULT_FOLDER || 'Uploads',
  allowedFormats: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: [
      // video formats
      'mp4', 'mov', 'avi', 'mkv', 'webm',
      // audio formats (Cloudinary treats them as video type)
      'mp3', 'wav', 'm4a', 'ogg', 'flac'
    ],
    raw: ['pdf', 'doc', 'docx', 'txt', 'zip']
  }
};

// Custom error classes
class UploadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadValidationError';
  }
}
class UploadError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadError';
  }
}

// Auto-detect resourceType from extension if not provided
const detectResourceType = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'raw';
  if (UPLOAD_CONFIG.allowedFormats.image.includes(ext)) return 'image';
  if (UPLOAD_CONFIG.allowedFormats.video.includes(ext)) return 'video';
  return 'raw';
};

const validateUpload = (file, folder, resourceType, options) => {
  if (!['image', 'video', 'raw'].includes(resourceType)) {
    throw new UploadValidationError('Invalid resource type');
  }

  const sanitizedFolder = sanitize(folder, { allowedTags: [] });
  if (!sanitizedFolder || sanitizedFolder.length > 100) {
    throw new UploadValidationError('Invalid or too long folder name');
  }

  if (!file) {
    throw new UploadValidationError('File is required');
  }

  // Multer file
  if (typeof file !== 'string') {
    if (!file.buffer || file.size > UPLOAD_CONFIG.maxFileSize) {
      throw new UploadValidationError(
        `File size exceeds ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit`
      );
    }

    const extension = file.originalname?.split('.').pop()?.toLowerCase();
    if (
      !extension ||
      !UPLOAD_CONFIG.allowedFormats[resourceType].includes(extension)
    ) {
      throw new UploadValidationError(
        `Invalid file format for ${resourceType}. Allowed: ${UPLOAD_CONFIG.allowedFormats[resourceType].join(', ')}`
      );
    }
  }

  // Base64 string
  if (typeof file === 'string' && !file.startsWith('data:')) {
    throw new UploadValidationError('Invalid base64 string');
  }

  return { sanitizedFolder, validatedOptions: options || {} };
};

// Main upload function
export const uploadMedia = async (
  file,
  folder = UPLOAD_CONFIG.defaultFolder,
  resourceType = '',
  options = {}
) => {
  const { tags, transformations, correlationId = uuidv4() } = options;
  let retryCount = 0;

  // Auto-detect resourceType if not explicitly set
  if (!resourceType && typeof file !== 'string') {
    resourceType = detectResourceType(file.originalname);
  } else if (!resourceType && typeof file === 'string') {
    resourceType = 'video'; // assume audio/video for base64 uploads
  }

  const { sanitizedFolder } = validateUpload(file, folder, resourceType, options);

  const uploadOptions = {
    folder: sanitizedFolder,
    resource_type: resourceType,
    tags,
    transformation: transformations,
    context: { correlationId }
  };

  logger.info('Starting media upload', {
    folder: sanitizedFolder,
    resourceType,
    correlationId,
    tags
  });

  while (retryCount <= UPLOAD_CONFIG.maxRetries) {
    try {
      let result;
      if (typeof file === 'string' && file.startsWith('data:')) {
        result = await cloudinary.uploader.upload(file, uploadOptions);
      } else {
        result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { ...uploadOptions },
            (error, result) => {
              if (error || !result) reject(error || new Error('Upload failed'));
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
      }

      logger.info('Media uploaded successfully', {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        folder: sanitizedFolder,
        resourceType,
        correlationId
      });

      return { secure_url: result.secure_url, public_id: result.public_id };
    } catch (error) {
      retryCount++;
      if (retryCount > UPLOAD_CONFIG.maxRetries) {
        logger.error('Media upload failed after retries', {
          error: error.message,
          stack: error.stack,
          folder: sanitizedFolder,
          resourceType,
          correlationId,
          retryCount
        });
        throw new UploadError('Media upload failed after maximum retries');
      }

      logger.warn('Retrying media upload', {
        error: error.message,
        folder: sanitizedFolder,
        resourceType,
        correlationId,
        retryCount
      });

      await new Promise((resolve) =>
        setTimeout(resolve, UPLOAD_CONFIG.retryDelay)
      );
    }
  }
};

// Initialize Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  logger.info('Cloudinary service initialized', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  });
} catch (error) {
  logger.error('Failed to initialize Cloudinary', {
    error: error.message,
    stack: error.stack
  });
  throw new Error('Cloudinary configuration failed');
}
