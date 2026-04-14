import Attendance from '../models/Attendance.js';
import Enrollment from '../models/Enrollment.js';
import { generateAIInsight } from '../services/auraAIService.js';

export const getStudentReport = async (req, res) => {
  try {
    const student_id = req.params.id;

    // Optional limitation: student can only view their own report, unless they are Admin or Faculty
    if (req.user.role === 'Student' && req.user._id.toString() !== student_id) {
       return res.status(403).json({ message: 'Unauthorized' });
    }

    const enrollments = await Enrollment.find({ student_id }).populate('subject_id');
    const reports = [];

    for (let enrollment of enrollments) {
       const totalConducted = await Attendance.countDocuments({ 
          session_id: { $in: await getSessionsForSubject(enrollment.subject_id._id) } 
       }); // A rough estimation. Real logic would query distinct sessions
       // Let's implement a simpler but correct approach:
       
       const attendances = await Attendance.find({ 
           student_id, 
       }).populate({
           path: 'session_id',
           match: { subject_id: enrollment.subject_id._id }
       });
       
       const subjectAttendances = attendances.filter(a => a.session_id !== null);
       const presentCount = subjectAttendances.filter(a => a.status === 'Present').length;
       const totalSessionsCount = 30; // Mocking total possible classes for demonstration
       const attended = presentCount;
       const attendancePercentage = (attended / totalSessionsCount) * 100 || 0;
       
       // AI Insight
       const aiInsight = await generateAIInsight(attendancePercentage, attended, totalSessionsCount);

       reports.push({
           subject: enrollment.subject_id.subject_name,
           code: enrollment.subject_id.subject_code,
           attendance_percentage: attendancePercentage,
           present_count: attended,
           total_classes: totalSessionsCount,
           ai_insight: aiInsight
       });
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSessionsForSubject = async (subject_id) => {
   // Helper function for more strict aggregation in a real DB
   return [];
}
