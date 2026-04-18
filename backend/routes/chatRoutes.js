import express from 'express';
import { askAI } from '../controllers/chatController.js';
// Assume we have an auth middleware, we could import it here if needed
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', askAI);

export default router;
