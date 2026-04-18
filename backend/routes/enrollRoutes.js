import express from 'express';
import { enrollStudent, getEnrolledStudents } from '../controllers/enrollController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, authorizeRoles('Student', 'Admin'), enrollStudent);
router.get('/subject/:subjectId/students', protect, authorizeRoles('Faculty', 'Admin'), getEnrolledStudents);

export default router;
