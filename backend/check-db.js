import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Subject = mongoose.model('Subject', new mongoose.Schema({
            subject_id: String,
            subject_code: String
        }));
        
        const subjects = await Subject.find({});
        console.log("CURRENT SUBJECTS IN DB:");
        subjects.forEach(s => console.log(`- ID: ${s.subject_id}, Code: ${s.subject_code}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSubjects();
