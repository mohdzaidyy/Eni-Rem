import express from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// financial data - owner only
router.use(protect, authorize('owner'));

router.post('/', createExpense);
router.get('/', getExpenses);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;