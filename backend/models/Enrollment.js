import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  enrollment_id: { type: String, required: true, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  semester_year: { type: String, required: true },
});

// Unique constraint to enforce 1 enrollment per student per subject
enrollmentSchema.index({ student_id: 1, subject_id: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
