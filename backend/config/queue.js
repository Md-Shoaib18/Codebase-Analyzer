// config/queue.js
import { Queue } from 'bullmq';

// Connect to local Redis (default port 6379)
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

// Create a new queue named 'repo-analysis'
export const analysisQueue = new Queue('repo-analysis', { connection });