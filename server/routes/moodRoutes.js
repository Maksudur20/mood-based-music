import express from 'express';
import { getMoods, getMoodById, createMood, addKeywordToMood, deleteKeyword } from '../controllers/moodController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMoods);
router.get('/:id', getMoodById);
router.post('/', requireAuth, requireAdmin, createMood);
router.post('/:id/keywords', requireAuth, requireAdmin, addKeywordToMood);
router.delete('/keywords/:keywordId', requireAuth, requireAdmin, deleteKeyword);

export default router;
