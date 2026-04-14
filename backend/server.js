import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Setup env and db
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

import routes from './routes/index.js';

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
