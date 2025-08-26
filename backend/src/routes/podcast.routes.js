import express from 'express';
import { getAllPodcasts, getPodcastById, createPodcast, updatePodcast, deletePodcast, togglePodcastStatus } from '../controllers/podcast.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for podcast cover image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// 🟢 Public routes
router.get('/', getAllPodcasts); // List all podcasts with optional category, search, pagination
router.get('/:id', getPodcastById); // Get a single podcast by ID

// 🟡 Authenticated routes
router.post(
  '/',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single('coverImage'), 
  createPodcast
);

router.put(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single('coverImage'),
  updatePodcast
);
router.delete('/:id', authenticateJWT, authorize([UserRole.ADMIN]), deletePodcast); // Delete a podcast

// 🔴 Admin-only route
router.patch('/:id/toggle-status', authenticateJWT, authorize([UserRole.ADMIN]), togglePodcastStatus); // Toggle podcast active/inactive status

export default router;