import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  addFieldToCategory,
  deleteCategory,
} from '../controllers/measurementCategory.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// owner AND tailor can manage categories - this is the "tailor adds a new
// category/sub-category as needed" feature from earlier
router.use(protect, authorize('owner', 'tailor'));

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.patch('/:id/fields', addFieldToCategory);
router.delete('/:id', authorize('owner'), deleteCategory);

export default router;