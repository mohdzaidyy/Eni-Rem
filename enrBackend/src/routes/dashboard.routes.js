import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('owner', 'tailor'), getDashboardStats);

export default router;