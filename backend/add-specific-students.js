import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const specificStudents = [
  { name: 'Sonu', branch: 'CSE', year: 3 },
  { name: 'Sippy', branch: 'CSE', year: 3 },
  { name: 'Maddy', branch: 'ECE', year: 3 },
  { name: 'Pavan', branch: 'ECE', year: 3 },
  { name: 'Kelitha', branch: 'CSE', year: 4 },
  { name: 'Shiva', branch: 'EEE', year: 3 },
  { name: 'Varshith', branch: 'MECH', year: 2 },
  { name: 'Chandu', branch: 'CIVIL', year: 1 },
  { name: 'Abhi', branch: 'ECE', year: 1 },
  { name: 'Priya', branch: 'CSE', year: 1 },
  { name: 'Pravlika', branch: 'CIVIL', year: 4 },
];

const seedSpecificStudents = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('aura123', salt);

    let addedCount = 0;
    const credentials = [];

    for (let i = 0; i < specificStudents.length; i++) {
        const student = specificStudents[i];
        const email = `${student.name.toLowerCase()}@aura.com`;
        const student_id = `S-3${String(i + 1).padStart(2, '0')}`;
        const user_id = `STU3${String(i + 1).padStart(2, '0')}`;

        const exists = await User.findOne({ email });
        if (exists) {
            console.log(`⏭️  Skipping ${student.name} (Email ${email} already exists)`);
            continue;
        }

        await User.create({
            user_id,
            name: student.name,
            email,
            password: hashedPassword,
            role: 'Student',
            student_id,
            branch: student.branch,
            year: student.year,
            device_id: `dev-${user_id.toLowerCase()}`,
            photo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff`
        });

        addedCount++;
        credentials.push({
            name: student.name,
            email,
            password: 'aura123'
        });
    }

    console.log(`\n🌟 Success!`);
    console.log(`✅ Added: ${addedCount} specific students`);
    console.log(`\n🔑 Login Credentials:`);
    credentials.forEach(c => {
        console.log(`${c.name}: ${c.email} / ${c.password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error Adding Students:', err.message);
    process.exit(1);
  }
};

seedSpecificStudents();
