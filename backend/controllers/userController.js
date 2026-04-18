import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Admin
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'Student' })
    .select('-password') // Don't send passwords
    .sort({ name: 1 });

  res.json(students);
});

// @desc    Get system stats for Admin
// @route   GET /api/users/stats
// @access  Private/Admin
export const getSystemStats = asyncHandler(async (req, res) => {
  const studentCount = await User.countDocuments({ role: 'Student' });
  const facultyCount = await User.countDocuments({ role: 'Faculty' });
  
  res.json({
    totalStudents: studentCount,
    totalFaculty: facultyCount
  });
});
