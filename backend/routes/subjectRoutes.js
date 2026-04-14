import express from 'express';
import { createSubject, getSubjects } from '../controllers/subjectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('Faculty', 'Admin'), createSubject)
  .get(protect, getSubjects);

export default router;
