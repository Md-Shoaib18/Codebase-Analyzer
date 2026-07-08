import express from 'express';
import dotenv from 'dotenv';
import analyzeRoute from './routes/analyzeRoute.js';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Codebase Analyzer API is running.');
});

app.use('/api/analyze', analyzeRoute);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});