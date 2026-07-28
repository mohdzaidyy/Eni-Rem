import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('owner', 'tailor'));

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id', updateOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', authorize('owner'), deleteOrder);

export default router;