import Attendance from '../models/Attendance.js';
import QRSession from '../models/QRSession.js';
import Enrollment from '../models/Enrollment.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import { validateGeofence } from '../services/geofenceService.js';

export const markAttendance = async (req, res) => {
  try {
    const { attendance_id, session_id, qr_token, latitude, longitude, device_id } = req.body;
    
    // Anti-Proxy Check — auto-register device on first real scan
    const student = await User.findById(req.user._id);
    const isPlaceholder = !student.device_id || student.device_id.startsWith('device-');
    if (isPlaceholder && device_id) {
      // First real scan: register their actual device
      await User.findByIdAndUpdate(req.user._id, { device_id });
    } else if (!isPlaceholder && device_id && student.device_id !== device_id) {
      return res.status(403).json({ message: 'Proxy attendance rejected. Device mismatch.' });
    }

    // Lookup session by ID or QR Token (for real-time scans)
    const session = qr_token 
      ? await QRSession.findOne({ qr_token }) 
      : await QRSession.findById(session_id);

    if (!session) return res.status(404).json({ message: 'Valid QR session not found' });
    
    // QR Expiration Check (60s window)
    if (Date.now() > session.expires_at) {
       return res.status(400).json({ message: 'QR Code expired' });
    }

    // Check Enrollment
    const isEnrolled = await Enrollment.findOne({ student_id: req.user._id, subject_id: session.subject_id });
    if (!isEnrolled) {
       return res.status(403).json({ message: 'Not enrolled in this subject' });
    }
    
    // Geofencing Check (Prioritize dynamic Faculty coordinates from session)
    const subject = await Subject.findById(session.subject_id);
    const targetLat = session.latitude || subject.latitude;
    const targetLng = session.longitude || subject.longitude;
    
    const geoValidation = validateGeofence(latitude, longitude, targetLat, targetLng, subject.radius);
    
    if (!geoValidation.isValid) {
      await Attendance.create({
         attendance_id, 
         student_id: req.user._id, 
         subject_id: session.subject_id,
         session_id, 
         status: 'Rejected', 
         latitude, 
         longitude, 
         distance_from_class: geoValidation.distance
      });
      return res.status(400).json({ message: 'Outside geofence area. Distance: ' + Math.ceil(geoValidation.distance) + 'm' });
    }

    // Success Mark
    const attendance = await Attendance.create({
      attendance_id, 
      student_id: req.user._id, 
      subject_id: session.subject_id, 
      session_id: session._id, 
      status: 'Present', 
      latitude, 
      longitude, 
      distance_from_class: geoValidation.distance
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) { // Unique index hit
      return res.status(400).json({ message: 'Attendance already recorded for this session' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const markManualAttendance = async (req, res) => {
  try {
    const { student_id, subject_id, status } = req.body;
    
    const attendance = await Attendance.create({
      attendance_id: `MAN-${Date.now()}-${student_id.slice(-4)}`,
      student_id,
      subject_id,
      session_id: null,
      status: status || 'Present',
      timestamp: new Date()
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { startDate, endDate } = req.query;

    let filter = { subject_id: subjectId };

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    } else {
      // Default to "Today" if no parameters provided
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      filter.timestamp = { $gte: startOfDay };
    }

    console.log("Generating report for Subject ID:", subjectId, "Filter:", JSON.stringify(filter));

    // Query by subject_id with dynamic date filter
    const attendances = await Attendance.find(filter)
      .populate('student_id', 'name student_id email');

    console.log("Total records found for report:", attendances.length);
    res.json(attendances);
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};
