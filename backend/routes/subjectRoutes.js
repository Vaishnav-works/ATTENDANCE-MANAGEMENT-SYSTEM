import express from 'express';
import { createSubject, getSubjects, updateSubjectLocation } from '../controllers/subjectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('Faculty', 'Admin'), createSubject)
  .get(protect, getSubjects);

// Developer Tool: Sync Hub Location
router.put('/sync-hub', protect, updateSubjectLocation);

export default router;
