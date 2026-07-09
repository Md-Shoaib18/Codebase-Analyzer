// routes/analyzeRoute.js
import express from "express";
import { analyzeRepo,getUserHistory,getJobStatus, deleteAnalysis } from "../controllers/analyzeController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

// router.post("/analyze", analyzeRepo);

router.post("/",protect,analyzeRepo)
router.get("/status/:jobId",protect,getJobStatus)
router.get("/history",protect,getUserHistory)
router.delete("/:id",protect,deleteAnalysis)

export default router;