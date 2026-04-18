import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seedDB from '../seed.js';

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (uri.includes('127.0.0.1')) {
      console.log('No external DB found: Starting temporary in-memory MongoDB Server...');
      console.log('NOTE: Downloading the MongoDB memory engine on first run could take 30-60 seconds.');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

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
