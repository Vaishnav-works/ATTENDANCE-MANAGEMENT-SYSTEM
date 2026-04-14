import express from 'express';
// import routes
import authRoutes from './authRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import enrollRoutes from './enrollRoutes.js';
import qrRoutes from './qrRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/enroll', enrollRoutes);
router.use('/qr', qrRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/reports', reportRoutes);

export default router;
