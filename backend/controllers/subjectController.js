import Subject from '../models/Subject.js';

export const createSubject = async (req, res) => {
  try {
    const { subject_id, subject_code, subject_name, latitude, longitude, radius } = req.body;
    const subject = await Subject.create({
      subject_id, subject_code, subject_name, faculty_id: req.user._id, latitude, longitude, radius
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
