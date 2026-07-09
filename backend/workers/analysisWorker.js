// workers/analysisWorker.js
import { Worker } from 'bullmq';
import Analysis from '../models/analysisModel.js';
import { cloneRepo } from '../services/repoService.js';
import { analyzeDependencies } from '../services/dependencyService.js';
import { scanFiles } from '../services/scanService.js';
import { analyzeComplexity } from '../services/complexityService.js';
import { generateInsights } from '../services/insightService.js';
import { detectDuplicates } from '../services/duplicateService.js';
import { scanForSecrets } from '../services/securityService.js';

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

export const startWorker = () => {
  const worker = new Worker('repo-analysis', async (job) => {
    const { repoUrl, userId } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for ${repoUrl}`);

    try {
      // 1. Heavy Lifting
      const repoPath = await cloneRepo(repoUrl);
      const dependencyInfo = analyzeDependencies(repoPath);
      const files = scanFiles(repoPath);
      
      const rawResults = files.map((file) => analyzeComplexity(file));
      const cleanedResults = rawResults.map(result => ({
        ...result,
        file: result.file.replace(repoPath, "").replace(/^[\\\/]+/, "").replace(/\\/g, "/")
      }));

      const insights = generateInsights(cleanedResults);

      const rawDuplicates = detectDuplicates(files);
      const cleanedDuplicates = rawDuplicates.map(duplicate => ({
          ...duplicate,
          occurrences: duplicate.occurrences.map(occ => ({
              ...occ,
              file: occ.file.replace(repoPath, "").replace(/^[\\\/]+/, "").replace(/\\/g, "/")
          }))
      }));

      const rawSecrets = scanForSecrets(files);
      const cleanedSecrets = rawSecrets.map(secret => ({
          ...secret,
          file: secret.file.replace(repoPath, "").replace(/^[\\\/]+/, "").replace(/\\/g, "/")
      }));

      // 2. Save to Database
      const newAnalysis = await Analysis.create({
          user: userId,
          repoUrl: repoUrl,
          totalFiles: files.length,
          averageComplexity: insights.averageComplexity,
          mostComplexFile: insights.mostComplexFile,
          duplicateInstances: cleanedDuplicates.length,
          securityIssues: cleanedSecrets.length
      });

      console.log(`[Worker] Completed job ${job.id}`);
      
      // 3. Return data to the queue so the frontend can fetch it later
      return { analysisId: newAnalysis._id, status: 'completed' };

    } catch (error) {
      console.error(`[Worker] Failed job ${job.id}:`, error);
      throw error; // BullMQ will automatically catch this and mark the job as failed
    }
  }, { connection });

  worker.on('failed', (job, err) => {
    console.log(`[Worker] Job ${job.id} has failed with ${err.message}`);
  });
};