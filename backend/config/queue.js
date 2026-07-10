// config/queue.js
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
// Connect to local Redis (default port 6379)

// console.log("redis url:", process.env.REDIS_URL);
// const connection = {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
//   tls: {}
// };

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Create a new queue named 'repo-analysis'
export const analysisQueue = new Queue('repo-analysis', { connection });