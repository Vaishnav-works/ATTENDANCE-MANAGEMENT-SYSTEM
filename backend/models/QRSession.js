import mongoose from 'mongoose';

const qrSessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  qr_token: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
});

const QRSession = mongoose.model('QRSession', qrSessionSchema);
export default QRSession;
