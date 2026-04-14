import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Faculty', 'Admin'], required: true },
  student_id: { type: String }, // Optional depending on role
  faculty_id: { type: String }, // Optional depending on role
  device_id: { type: String, required: true }, // Used for anti-proxy validation
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
