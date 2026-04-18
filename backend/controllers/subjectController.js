import Subject from '../models/Subject.js';

export const createSubject = async (req, res) => {
  try {
    console.log("SUBJECT CREATION REQUEST RECEIVED");
    console.log("Body:", req.body);
    console.log("User:", req.user?._id, req.user?.role);

    const { subject_id, subject_code, subject_name, branch, year, semester, faculty_id, class_time } = req.body;
    
    const subject = await Subject.create({
      subject_id, 
      subject_code, 
      subject_name, 
      branch, 
      year, 
      semester,
      faculty_id: faculty_id || null,
      class_time: class_time || 'TBD'
    });
    
    console.log("Subject Created Successfully:", subject._id);
    res.status(201).json(subject);
  } catch (error) {
    console.error("SUBJECT CREATION FAILED:", error.message);
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

// Developer/Testing Tool: Update Subject Location
export const updateSubjectLocation = async (req, res) => {
  try {
    const { subjectId, latitude, longitude } = req.body;
    
    // For testing simplicity, if no subjectId is provided, update ALL subjects 
    // to match the user's current testing spot.
    const filter = subjectId ? { _id: subjectId } : {};
    
    const result = await Subject.updateMany(filter, {
      $set: { 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude),
        radius: 40 // Ensure radius is reset to 40m for testing
      }
    });

    console.log(`✅ TEST SYNC: Updated ${result.modifiedCount} subjects to [${latitude}, ${longitude}]`);
    
    res.json({ 
      success: true, 
      message: `Successfully synced ${result.modifiedCount} class hub(s) to your location.` 
    });
  } catch (error) {
    console.error("SYNC FAILED:", error.message);
    res.status(500).json({ message: error.message });
  }
};
