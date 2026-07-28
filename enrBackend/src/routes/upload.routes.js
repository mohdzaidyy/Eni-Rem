import express from 'express';
import upload from '../middleware/upload.js';
import { uploadImage, uploadImages } from '../controllers/upload.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('owner', 'tailor'));

// single image - fabric photo (camera capture or paste)
router.post('/image', upload.single('image'), uploadImage);

// multiple images - inspiration references (file picker or paste, up to 10 at once)
router.post('/images', upload.array('images', 10), uploadImages);

export default router;