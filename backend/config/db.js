import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seedDB from '../seed.js';

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    if (uri.indexOf('127.0.0.1') !== -1 || uri.indexOf('localhost') !== -1) {

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we need to seed because the DB is empty (First time use)
    const User = (await import('../models/User.js')).default;
    const userCount = await User.countDocuments();
    
    if (userCount === 0 || mongoServer) {
       console.log("Database looks empty or temporary. Running Seed Initializer...");
       await seedDB();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
