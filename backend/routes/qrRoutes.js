import express from 'express';
import { generateQR } from '../controllers/qrController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/generate', protect, authorizeRoles('Faculty', 'Admin'), generateQR);

export default router;
