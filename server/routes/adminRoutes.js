import express from 'express';
import { getSystemStats, getUsers, updateUserRole } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', getSystemStats);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);

export default router;
