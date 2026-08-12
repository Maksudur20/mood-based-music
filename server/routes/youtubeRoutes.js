import express from 'express';
import { searchMusic, getMoodRecommendations, getVideoInfo } from '../controllers/youtubeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', optionalAuth, searchMusic);
router.get('/mood/:mood', getMoodRecommendations);
router.get('/video/:videoId', getVideoInfo);

export default router;
