import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const targetStudentNames = [
  'Sonu', 'Sippy', 'Maddy', 'Pavan', 'Kelitha', 
  'Shiva', 'Varshith', 'Chandu', 'Abhi', 'Priya', 'Pravlika'
];

const enrollSpecificStudents = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    let enrollmentCount = 0;
    const semesterYear = 'Fall 2026';

    for (const name of targetStudentNames) {
      const student = await User.findOne({ name, role: 'Student' });
      if (!student) {
        console.log(`⚠️  Student not found: ${name}`);
        continue;
      }

      // Find subjects matching student's branch and year
      const matchingSubjects = await Subject.find({ 
        branch: student.branch, 
        year: student.year 
      });

      if (matchingSubjects.length === 0) {
        console.log(`⚠️  No subjects found for ${name} (${student.branch} Year ${student.year})`);
        continue;
      }

      for (const subject of matchingSubjects) {
        // Check if already enrolled
        const exists = await Enrollment.findOne({ 
          student_id: student._id, 
          subject_id: subject._id 
        });

        if (exists) continue;

        await Enrollment.create({
          enrollment_id: `ENR-${student.user_id}-${subject.subject_code}`,
          student_id: student._id,
          subject_id: subject._id,
          semester_year: semesterYear
        });
        enrollmentCount++;
      }
      console.log(`✅ Enrolled ${name} in ${matchingSubjects.length} subjects.`);
    }

    console.log(`\n🌟 Enrollment Complete!`);
    console.log(`✅ Total new enrollments created: ${enrollmentCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Enrollment Error:', err.message);
    process.exit(1);
  }
};

enrollSpecificStudents();
