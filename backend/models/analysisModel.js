// backend/models/analysisModel.js
import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoUrl: { type: String, required: true },
    totalFiles: { type: Number, required: true },
    averageComplexity: { type: Number, required: true },
    mostComplexFile: { file: String, score: Number },
    topComplexFiles: { type: Array, default: [] },
    duplicates: { type: Array, default: [] },
    securityIssues: { type: Array, default: [] },
    
    // NEW: Add these two so Mongoose allows them to be saved!
    projectSetup: { type: Object, default: {} },
    analysis: { type: Array, default: [] }
    
}, { timestamps: true });

export default mongoose.model('Analysis', analysisSchema);