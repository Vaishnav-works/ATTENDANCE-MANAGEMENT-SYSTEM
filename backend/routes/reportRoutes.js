import express from 'express';
import { getStudentReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student/:id', protect, getStudentReport);

export default router;
