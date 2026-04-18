import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('🚀 Starting AuraAI Database Reset & Seed...');

    // Clear existing data
    await User.deleteMany();
    await Subject.deleteMany();
    await Enrollment.deleteMany();
    console.log('✅ Database purged.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('aura123', salt);

    // ── ADMINS (3) ──────────────────────────
    const admins = [
      { user_id: 'ADM001', name: 'System Admin One', email: 'admin1@aura.com', password: hashedPassword, role: 'Admin', device_id: 'dev-admin1', photo_url: 'https://ui-avatars.com/api/?name=Admin+One&background=6366F1&color=fff' },
      { user_id: 'ADM002', name: 'System Admin Two', email: 'admin2@aura.com', password: hashedPassword, role: 'Admin', device_id: 'dev-admin2', photo_url: 'https://ui-avatars.com/api/?name=Admin+Two&background=8b5cf6&color=fff' },
      { user_id: 'ADM003', name: 'System Admin Three', email: 'admin3@aura.com', password: hashedPassword, role: 'Admin', device_id: 'dev-admin3', photo_url: 'https://ui-avatars.com/api/?name=Admin+Three&background=ec4899&color=fff' },
    ];
    await User.insertMany(admins);
    console.log('✅ 3 Admins created.');

    // ── FACULTY (3) ──────────────────────────
    const facultyData = [
      { user_id: 'FAC001', name: 'Prof. Alan Turing', email: 'faculty1@aura.com', password: hashedPassword, role: 'Faculty', faculty_id: 'F-101', device_id: 'dev-fac1', branch: 'Computer Science', designation: 'Senior Professor', photo_url: 'https://ui-avatars.com/api/?name=Alan+Turing&background=10b981&color=fff' },
      { user_id: 'FAC002', name: 'Prof. Ada Lovelace', email: 'faculty2@aura.com', password: hashedPassword, role: 'Faculty', faculty_id: 'F-102', device_id: 'dev-fac2', branch: 'Mathematics', designation: 'Associate Professor', photo_url: 'https://ui-avatars.com/api/?name=Ada+Lovelace&background=3b82f6&color=fff' },
      { user_id: 'FAC003', name: 'Prof. Grace Hopper', email: 'faculty3@aura.com', password: hashedPassword, role: 'Faculty', faculty_id: 'F-103', device_id: 'dev-fac3', branch: 'Information Technology', designation: 'Head of Department', photo_url: 'https://ui-avatars.com/api/?name=Grace+Hopper&background=f59e0b&color=fff' },
    ];
    const faculties = await User.insertMany(facultyData);
    console.log('✅ 3 Faculty members created.');

    // ── STUDENTS (3) ──────────────────────────
    const studentData = [
      { user_id: 'STU001', name: 'John Student', email: 'student1@aura.com', password: hashedPassword, role: 'Student', student_id: 'S-201', device_id: 'dev-stu1', branch: 'CSE', year: 3, photo_url: 'https://ui-avatars.com/api/?name=John+Student&background=6366F1&color=fff' },
      { user_id: 'STU002', name: 'Sarah Student', email: 'student2@aura.com', password: hashedPassword, role: 'Student', student_id: 'S-202', device_id: 'dev-stu2', branch: 'ECE', year: 2, photo_url: 'https://ui-avatars.com/api/?name=Sarah+Student&background=ec4899&color=fff' },
      { user_id: 'STU003', name: 'Mike Student', email: 'student3@aura.com', password: hashedPassword, role: 'Student', student_id: 'S-203', device_id: 'dev-stu3', branch: 'MECHANICAL', year: 4, photo_url: 'https://ui-avatars.com/api/?name=Mike+Student&background=10b981&color=fff' },
    ];
    const students = await User.insertMany(studentData);
    console.log('✅ 3 Students created.');

    // ── CORE SUBJECTS (60) ───────────────────
    const branchNames = ['CSE', 'ECE', 'MECHANICAL', 'CIVIL', 'EEE'];
    const subjectsToCreate = [];
    
    // Realistic Subject Name Map
    const subjectMap = {
      'CSE': [
        ['C Programming', 'Digital Logic', 'Mathematics-I'], // Y1
        ['Data Structures', 'DBMS', 'Computer Organization'], // Y2
        ['Operating Systems', 'Networks', 'Machine Learning'], // Y3
        ['Cloud Computing', 'Cyber Security', 'DevOps'] // Y4
      ],
      'ECE': [
        ['Network Analysis', 'Electronic Devices', 'Engineering Physics'], // Y1
        ['Signals & Systems', 'Digital Electronics', 'Analog Circuits'], // Y2
        ['Microprocessors', 'VLSI Design', 'Communication Systems'], // Y3
        ['Embedded Systems', 'Optical Networks', 'Satellite Comm'] // Y4
      ],
      'MECHANICAL': [
        ['Eng. Mechanics', 'Thermodynamics', 'Material Science'], // Y1
        ['Fluid Mechanics', 'Solid Mechanics', 'Manufacturing Tech'], // Y2
        ['Heat Transfer', 'Machine Design', 'Dynamics of Machinery'], // Y3
        ['CAD/CAM', 'Mechatronics', 'Automobile Engineering'] // Y4
      ],
      'CIVIL': [
        ['Eng. Physics', 'Surveying-I', 'Building Materials'], // Y1
        ['Fluid Mechanics', 'Strength of Materials', 'Surveying-II'], // Y2
        ['Structural Analysis', 'Geotechnical Eng.', 'Hydraulic Eng.'], // Y3
        ['Design of Steel', 'Construction Mgmt', 'Transportation Eng'] // Y4
      ],
      'EEE': [
        ['Maths-I', 'Basic Electrical', 'Eng. Chemistry'], // Y1
        ['Power Systems-I', 'Electrical Machines', 'Control Systems'], // Y2
        ['Power Electronics', 'Electromagnetic Fields', 'Measurements'], // Y3
        ['Renewable Energy', 'High Voltage Eng.', 'Smart Grids'] // Y4
      ]
    };

    for (const branch of branchNames) {
      for (let year = 1; year <= 4; year++) {
        const branchSubjects = subjectMap[branch][year-1];
        for (let i = 0; i < 3; i++) {
          subjectsToCreate.push({
            subject_id: `${branch}-${year}0${i + 1}`,
            subject_code: `${branch}-${year}0${i + 1}`,
            subject_name: branchSubjects[i],
            class_time: i === 0 ? '09:00 AM - 10:30 AM' : i === 1 ? '11:00 AM - 12:30 PM' : '02:00 PM - 03:30 PM',
            branch: branch,
            year: year,
            semester: year % 2 === 0 ? 'Spring' : 'Fall',
            faculty_id: faculties[i % faculties.length]._id, // Rotating faculty
            latitude: 12.9716,
            longitude: 77.5946,
            radius: 40
          });
        }
      }
    }

    const createdSubjects = await Subject.insertMany(subjectsToCreate);
    console.log(`✅ ${createdSubjects.length} Subjects created across all branches.`);

    // ── ENROLL STUDENTS ──────────────────────
    const enrollments = [];
    students.forEach((student, sIdx) => {
      // Enroll each student in 5 subjects of their matching branch (pseudo-realistic)
      const studentBranch = student.branch;
      const studentYear = student.year;
      const matchingSubjects = createdSubjects.filter(sub => sub.branch === studentBranch && sub.year === studentYear);
      
      matchingSubjects.forEach((sub, subIdx) => {
        enrollments.push({
          enrollment_id: `ENR-${student.user_id}-${sub.subject_code}`,
          student_id: student._id,
          subject_id: sub._id,
          semester_year: `${sub.semester} 2026`
        });
      });
    });

    await Enrollment.insertMany(enrollments);
    console.log(`✅ ${enrollments.length} Student enrollments created.`);

    console.log('\n🌟 RESET COMPLETE 🌟');
    console.log('Password for all: aura123\n');
  } catch (error) {
    console.error('❌ Reset error:', error.message);
    throw error; // Let the caller handle failure
  }
};

// Check if running directly via "node seed.js"
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(async () => {
        await seedDB();
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  } else {
    console.log('No MONGO_URI found in .env');
    process.exit(1);
  }
}

export default seedDB;
