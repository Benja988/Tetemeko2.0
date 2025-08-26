import express from 'express';
import {
  getAllEpisodes,
  getEpisodeById,
  addEpisode,
  updateEpisode,
  deleteEpisode,
} from '../controllers/episode.controller.js';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/User.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for episode audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/mpeg',   // .mp3
      'audio/wav',    // .wav
      'audio/x-wav',
      'audio/x-m4a',  // .m4a
      'audio/flac',   // .flac
      'audio/ogg',    // .ogg
      'video/mp4',    // sometimes m4a is tagged as mp4 container
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: mp3, wav, m4a, ogg, flac'), false);
    }
  },
});

// 🟢 Public routes
router.get('/:podcastId/episodes', getAllEpisodes); // List all episodes for a podcast
router.get('/:podcastId/episodes/:episodeId', getEpisodeById); // Get a single episode by ID

// 🟡 Authenticated routes
router.post(
  '/:podcastId/episodes',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single('audioFile'),
  addEpisode
);

router.put(
  '/:podcastId/episodes/:episodeId',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  upload.single('audioFile'),
  updateEpisode
);

router.delete(
  '/:podcastId/episodes/:episodeId',
  authenticateJWT,
  authorize([UserRole.ADMIN]),
  deleteEpisode
);

export default router;
