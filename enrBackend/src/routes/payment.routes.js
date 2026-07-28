import express from 'express';
import {
  createPayment,
  getPaymentsForOrder,
  deletePayment,
} from '../controllers/payment.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('owner', 'tailor'));

router.post('/', createPayment);
router.get('/order/:orderId', getPaymentsForOrder);
router.delete('/:id', authorize('owner'), deletePayment);

export default router;