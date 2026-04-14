import Enrollment from '../models/Enrollment.js';

export const enrollStudent = async (req, res) => {
  try {
    const { enrollment_id, subject_id, semester_year } = req.body;
    const existing = await Enrollment.findOne({ student_id: req.user._id, subject_id });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this subject' });
    }
    const enrollment = await Enrollment.create({
      enrollment_id, student_id: req.user._id, subject_id, semester_year
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
