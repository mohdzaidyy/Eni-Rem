import express from 'express';
import {
  createTailor,
  getTailors,
  getTailorById,
  updateTailor,
  deleteTailor,
} from '../controllers/tailor.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('owner'), createTailor);
router.get('/', authorize('owner', 'tailor'), getTailors);
router.get('/:id', authorize('owner', 'tailor'), getTailorById);
router.patch('/:id', authorize('owner'), updateTailor);
router.delete('/:id', authorize('owner'), deleteTailor);

export default router;