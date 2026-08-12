import express from 'express';
import { getProfile, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
