import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject_id: { type: String, required: true, unique: true },
  subject_code: { type: String, required: true },
  subject_name: { type: String, required: true },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, default: 50 },
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
