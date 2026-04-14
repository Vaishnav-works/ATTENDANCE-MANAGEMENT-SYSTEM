import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const seedDB = async () => {
  try {
    console.log('Using active connection for Seeding...');

    await User.deleteMany();
    await Subject.deleteMany();
    await Enrollment.deleteMany();
    console.log('Database cleared of old test data.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const student = await User.create({
      user_id: 'STU001',
      name: 'Alice Smith',
      email: 'student@example.com',
      password,
      role: 'Student',
      student_id: 'S-8899',
      device_id: 'device-1234'
    });

    const faculty = await User.create({
      user_id: 'FAC001',
      name: 'Dr. John Doe',
      email: 'faculty@example.com',
      password,
      role: 'Faculty',
      faculty_id: 'F-1122',
      device_id: 'device-5678'
    });

    const admin = await User.create({
      user_id: 'ADM001',
      name: 'Super Admin',
      email: 'admin@example.com',
      password,
      role: 'Admin',
      device_id: 'device-admin'
    });

    console.log('Test Users Created:');
    console.log('Student Email: student@example.com | Pass: password123');
    console.log('Faculty Email: faculty@example.com | Pass: password123');
    console.log('Admin Email:   admin@example.com   | Pass: password123');

    const subject = await Subject.create({
      subject_id: 'CS101',
      subject_code: 'CS101',
      subject_name: 'Introduction to Computer Science',
      faculty_id: faculty._id,
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 50
    });
    console.log('Test Subject Created:', subject.subject_name);

    await Enrollment.create({
      enrollment_id: 'ENR-001',
      student_id: student._id,
      subject_id: subject._id,
      semester_year: 'Fall 2026'
    });
    console.log('Test Student Enrolled in Class.');

    console.log('Data Seeding Complete!');
  } catch (error) {
    console.error('Error with Seeding:', error.message);
  }
};

export default seedDB;
