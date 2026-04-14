import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  attendance_id: { type: String, required: true, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QRSession', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Rejected'], required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  distance_from_class: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

// Unique constraint to avoid multiple attendances per session
attendanceSchema.index({ student_id: 1, session_id: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
