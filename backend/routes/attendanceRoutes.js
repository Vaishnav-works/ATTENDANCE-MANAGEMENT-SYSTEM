import express from 'express';
import { markAttendance } from '../controllers/attendanceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/mark', protect, authorizeRoles('Student'), markAttendance);

export default router;
