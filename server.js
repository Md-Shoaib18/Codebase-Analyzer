import express from 'express';
import dotenv from 'dotenv';
import analyzeRoute from './routes/analyzeRoute.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Codebase Analyzer API is running.');
});

app.use('/api', analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});