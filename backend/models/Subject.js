import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subject_id: { type: String, required: true, unique: true },
  subject_code: { type: String, required: true, unique: true },
  subject_name: { type: String, required: true },
  branch: { type: String, required: true, enum: ['ECE', 'CSE', 'MECHANICAL', 'CIVIL', 'EEE', 'MECH'] },
  year: { type: Number, required: true, enum: [1, 2, 3, 4] },
  semester: { type: String, required: true },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class_time: { type: String, default: 'TBD' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  radius: { type: Number, default: 40 },
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
