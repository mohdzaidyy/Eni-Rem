import express from 'express';
import {
  createMeasurement,
  getMeasurementsForCustomer,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
} from '../controllers/measurement.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('owner', 'tailor'));

router.post('/', createMeasurement);
router.get('/customer/:customerId', getMeasurementsForCustomer);
router.get('/:id', getMeasurementById);
router.patch('/:id', updateMeasurement);
router.delete('/:id', deleteMeasurement);

export default router;