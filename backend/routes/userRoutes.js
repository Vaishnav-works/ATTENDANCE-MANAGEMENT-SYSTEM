import express from 'express';
import { getAllStudents, getSystemStats } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and restricted to Admin
router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/students', getAllStudents);
router.get('/stats', getSystemStats);

export default router;
