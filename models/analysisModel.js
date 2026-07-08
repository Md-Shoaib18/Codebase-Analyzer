// models/analysisModel.js
import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoUrl: { type: String, required: true },
    totalFiles: { type: Number, required: true },
    averageComplexity: { type: Number, required: true },
    mostComplexFile: {
        file: String,
        score: Number
    },
    duplicateInstances: { type: Number, default: 0 } 
}, { timestamps: true }); 

export default mongoose.model('Analysis', analysisSchema);