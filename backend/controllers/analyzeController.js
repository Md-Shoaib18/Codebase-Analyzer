import { cloneRepo } from "../services/repoService.js";
import { scanFiles } from "../services/scanService.js";
import { analyzeComplexity } from "../services/complexityService.js";
import { generateInsights } from "../services/insightService.js";
import { detectDuplicates } from "../services/duplicateService.js";
import { analyzeDependencies } from "../services/dependencyService.js";
import { scanForSecrets } from "../services/securityService.js"; 
import Analysis from "../models/analysisModel.js";
import {analysisQueue} from '../config/queue.js';

export const analyzeRepo = async (req, res) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: "Repo URL is required" });
        }

        // Drop the job into Redis
        const job = await analysisQueue.add('analyze', { 
            repoUrl, 
            userId: req.user.id 
        });

        // Immediately respond to the client (Main thread is unblocked!)
        res.status(202).json({
            status: "processing", 
            message: "Repository is being analyzed in the background.",
            jobId: job.id // The frontend needs this to check the status later
        });

    } catch (error) {
        console.error("Queue Error:", error);
        return res.status(500).json({ success: 'false', message: "Failed to queue job" });
    }
};

// NEW: Endpoint for the frontend to check if the job is done
export const getJobStatus = async (req, res) => {
    const { jobId } = req.params;
    
    try {
        const job = await analysisQueue.getJob(jobId);
        
        if (!job) return res.status(404).json({ message: "Job not found" });

        const state = await job.getState(); // 'waiting', 'active', 'completed', 'failed'
        
        if (state === 'completed') {
            return res.json({ status: 'completed', result: job.returnvalue });
        } else if (state === 'failed') {
            return res.json({ status: 'failed', error: job.failedReason });
        } else {
            return res.json({ status: state }); // 'active' or 'waiting'
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching job status" });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        // Find all analyses belonging to this user, sort by newest first
        const history = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.json({
            status: "success",
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: "Failed to fetch user history" });
    }
};
