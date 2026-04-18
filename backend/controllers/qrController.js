import QRSession from '../models/QRSession.js';
import crypto from 'crypto';

export const generateQR = async (req, res) => {
  try {
    const { session_id, subject_id, latitude, longitude } = req.body;
    
    // Auto-generate session ID if not provided (Format: SESS-[CODE]-[TIMESTAMP])
    const final_session_id = session_id || `SESS-${Date.now()}`;
    
    // Generate a unique token
    const qr_token = crypto.randomBytes(16).toString('hex');
    
    // Set expiry for 60 seconds
    const expires_at = new Date(Date.now() + 60 * 1000);

    const qrSession = await QRSession.create({
      session_id: final_session_id, subject_id, qr_token, latitude, longitude, expires_at
    });

    res.status(201).json(qrSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveSession = async (req, res) => {
  try {
    // Find sessions created within the last 60 seconds (active)
    const session = await QRSession.findOne({
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 });

    if (!session) {
      return res.status(404).json({ message: 'No active session found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
