import express from 'express';
// import routes
import authRoutes from './authRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import enrollRoutes from './enrollRoutes.js';
import qrRoutes from './qrRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import reportRoutes from './reportRoutes.js';
import chatRoutes from './chatRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Root API Health Check
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AuraAI Backend Systems Operational',
    version: '1.0.0'
  });
});

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/enroll', enrollRoutes);
router.use('/qr', qrRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/reports', reportRoutes);
router.use('/chat', chatRoutes);
router.use('/users', userRoutes);

export default router;
