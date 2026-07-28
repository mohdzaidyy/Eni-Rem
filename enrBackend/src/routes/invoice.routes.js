import express from 'express';
import {
  generateInvoice,
  getInvoiceByOrder,
  getInvoices,
} from '../controllers/invoice.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('owner', 'tailor'));

router.post('/order/:orderId', generateInvoice);
router.get('/order/:orderId', getInvoiceByOrder);
router.get('/', getInvoices);

export default router;