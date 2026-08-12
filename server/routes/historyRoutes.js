import express from 'express';
import { getHistory, addHistory, clearHistory } from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getHistory);
router.post('/', addHistory);
router.delete('/', clearHistory);

export default router;
