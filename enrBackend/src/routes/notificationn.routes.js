import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// any logged-in role (owner/tailor/customer) can see their own notifications
router.use(protect);

router.get('/', getMyNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;