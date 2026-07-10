import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import analyzeRoute from './routes/analyzeRoute.js';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import {startWorker} from './workers/analysisWorker.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [ 'https://codebase-analyzer-five.vercel.app', 'http://localhost:5173'  ],
  credentials: true, // Allow cookies to be sent
}));

// console.log("redis url:", process.env.REDIS_URL);
// console.log("redis host:", process.env.REDIS_HOST);
// console.log("redis port:", process.env.REDIS_PORT);
// console.log("redis password:", process.env.REDIS_PASSWORD);

connectDB();

startWorker();

app.get('/', (req, res) => {
  res.send('Codebase Analyzer API is running.');
});

app.use('/api/analyze', analyzeRoute);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});