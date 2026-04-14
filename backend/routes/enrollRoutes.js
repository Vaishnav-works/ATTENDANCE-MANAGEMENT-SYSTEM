import express from 'express';
import { enrollStudent } from '../controllers/enrollController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, authorizeRoles('Student', 'Admin'), enrollStudent);

export default router;
