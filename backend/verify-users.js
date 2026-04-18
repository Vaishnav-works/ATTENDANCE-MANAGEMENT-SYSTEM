import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const verifyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String
        }));
        
        const users = await User.find({});
        console.log("TOTAL USERS IN DB:", users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyUsers();
