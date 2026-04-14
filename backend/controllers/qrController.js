import QRSession from '../models/QRSession.js';
import crypto from 'crypto';

export const generateQR = async (req, res) => {
  try {
    const { session_id, subject_id } = req.body;
    
    // Generate a unique token
    const qr_token = crypto.randomBytes(16).toString('hex');
    
    // Set expiry for 60 seconds
    const expires_at = new Date(Date.now() + 60 * 1000);

    const qrSession = await QRSession.create({
      session_id, subject_id, qr_token, expires_at
    });

    res.status(201).json(qrSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
