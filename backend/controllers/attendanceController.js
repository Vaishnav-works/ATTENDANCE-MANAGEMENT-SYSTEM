import Attendance from '../models/Attendance.js';
import QRSession from '../models/QRSession.js';
import Enrollment from '../models/Enrollment.js';
import Subject from '../models/Subject.js';
import { validateGeofence } from '../services/geofenceService.js';

export const markAttendance = async (req, res) => {
  try {
    const { attendance_id, session_id, latitude, longitude, device_id } = req.body;
    
    // Anti-Proxy Check
    if (req.user.device_id !== device_id) {
       return res.status(403).json({ message: 'Proxy attendance rejected. Device mismatch.' });
    }

    const session = await QRSession.findById(session_id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    
    // QR Expiration Check (60s window)
    if (Date.now() > session.expires_at) {
       return res.status(400).json({ message: 'QR Code expired' });
    }

    // Check Enrollment
    const isEnrolled = await Enrollment.findOne({ student_id: req.user._id, subject_id: session.subject_id });
    if (!isEnrolled) {
       return res.status(403).json({ message: 'Not enrolled in this subject' });
    }
    
    // Geofencing Check
    const subject = await Subject.findById(session.subject_id);
    const geoValidation = validateGeofence(latitude, longitude, subject.latitude, subject.longitude, subject.radius);
    
    if (!geoValidation.isValid) {
      await Attendance.create({
         attendance_id, student_id: req.user._id, session_id, 
         status: 'Rejected', latitude, longitude, distance_from_class: geoValidation.distance
      });
      return res.status(400).json({ message: 'Outside geofence area. Distance: ' + Math.ceil(geoValidation.distance) + 'm' });
    }

    // Success Mark
    const attendance = await Attendance.create({
      attendance_id, student_id: req.user._id, session_id, 
      status: 'Present', latitude, longitude, distance_from_class: geoValidation.distance
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) { // Unique index hit
      return res.status(400).json({ message: 'Attendance already recorded for this session' });
    }
    res.status(500).json({ message: error.message });
  }
};
