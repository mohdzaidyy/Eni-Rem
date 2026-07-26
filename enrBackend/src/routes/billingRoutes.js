// Example only - shows how protect + authorize combine on a real route.
// Wire this the same way for your actual Order/Customer/Payment routes.

import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// only the owner can view billing/revenue - tailor and customer get 403
router.get('/', protect, authorize('owner'), (req, res) => {
  res.json({ message: `Billing data for ${req.user.name}` });
});

// owner AND tailor can update order status; customer cannot
router.patch('/orders/:id/status', protect, authorize('owner', 'tailor'), (req, res) => {
  res.json({ message: `Order status updated by ${req.user.role}` });
});

export default router;