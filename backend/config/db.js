import mongoose from 'mongoose';
import seedDB from '../seed.js';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error('CRITICAL: MONGO_URI is not defined in Render environment variables!');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we need to seed because the DB is empty (First time use)
    const User = (await import('../models/User.js')).default;
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
       console.log("ℹ️ Database looks empty. Running Seed Initializer...");
       await seedDB();
    }
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
