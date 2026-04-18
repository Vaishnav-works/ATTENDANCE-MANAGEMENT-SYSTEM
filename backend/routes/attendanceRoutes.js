import express from 'express';
import { markAttendance, markManualAttendance, getSubjectAttendance } from '../controllers/attendanceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/mark', protect, authorizeRoles('Student'), markAttendance);
router.post('/manual', protect, authorizeRoles('Faculty', 'Admin'), markManualAttendance);
router.get('/subject/:subjectId', protect, authorizeRoles('Faculty', 'Admin'), getSubjectAttendance);

export default router;
