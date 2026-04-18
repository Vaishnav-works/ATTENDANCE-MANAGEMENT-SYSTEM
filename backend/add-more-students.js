import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const additionalStudents = [
  { user_id: 'STU010', name: 'Aarav Sharma', email: 'sharma.aarav@aura.com', student_id: 'S-210', branch: 'CSE', year: 2 },
  { user_id: 'STU011', name: 'Priya Patel', email: 'patel.priya@aura.com', student_id: 'S-211', branch: 'ECE', year: 3 },
  { user_id: 'STU012', name: 'Aditya Gupta', email: 'gupta.aditya@aura.com', student_id: 'S-212', branch: 'MECHANICAL', year: 1 },
  { user_id: 'STU013', name: 'Ananya Iyer', email: 'iyer.ananya@aura.com', student_id: 'S-213', branch: 'CIVIL', year: 4 },
  { user_id: 'STU014', name: 'Vihaan Reddy', email: 'reddy.vihaan@aura.com', student_id: 'S-214', branch: 'EEE', year: 2 },
  { user_id: 'STU015', name: 'Ishani Roy', email: 'roy.ishani@aura.com', student_id: 'S-215', branch: 'CSE', year: 3 },
  { user_id: 'STU016', name: 'Kabir Singh', email: 'singh.kabir@aura.com', student_id: 'S-216', branch: 'ECE', year: 2 },
  { user_id: 'STU017', name: 'Myra Kapoor', email: 'kapoor.myra@aura.com', student_id: 'S-217', branch: 'MECHANICAL', year: 3 },
  { user_id: 'STU018', name: 'Aryan Verma', email: 'verma.aryan@aura.com', student_id: 'S-218', branch: 'CIVIL', year: 1 },
  { user_id: 'STU019', name: 'Saanvi Nair', email: 'nair.saanvi@aura.com', student_id: 'S-219', branch: 'EEE', year: 4 },
  { user_id: 'STU020', name: 'Rohan Deshmukh', email: 'deshmukh.rohan@aura.com', student_id: 'S-220', branch: 'CSE', year: 1 },
  { user_id: 'STU021', name: 'Tara Malhotra', email: 'malhotra.tara@aura.com', student_id: 'S-221', branch: 'ECE', year: 4 },
  { user_id: 'STU022', name: 'Ishaan Joshi', email: 'joshi.ishaan@aura.com', student_id: 'S-222', branch: 'MECHANICAL', year: 2 },
  { user_id: 'STU023', name: 'Avni Saxena', email: 'saxena.avni@aura.com', student_id: 'S-223', branch: 'CIVIL', year: 3 },
  { user_id: 'STU024', name: 'Reyansh Mishra', email: 'mishra.reyansh@aura.com', student_id: 'S-224', branch: 'EEE', year: 1 },
];

const seedAdditionalStudents = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('aura123', salt);

    let addedCount = 0;
    let skippedCount = 0;

    for (const student of additionalStudents) {
      const exists = await User.findOne({ email: student.email });
      if (exists) {
        skippedCount++;
        continue;
      }

      await User.create({
        ...student,
        password: hashedPassword,
        role: 'Student',
        device_id: `dev-${student.user_id.toLowerCase()}`,
        photo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff`
      });
      addedCount++;
    }

    console.log(`\n🌟 Seeding Complete!`);
    console.log(`✅ Added: ${addedCount} new students`);
    console.log(`⏭️  Skipped: ${skippedCount} existing students`);
    console.log(`🔑 Login Password for all: aura123\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedAdditionalStudents();
