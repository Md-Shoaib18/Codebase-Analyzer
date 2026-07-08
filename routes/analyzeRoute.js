// routes/analyzeRoute.js
import express from "express";
import { analyzeRepo,getUserHistory } from "../controllers/analyzeController.js";
import { protect } from "../utils/authMiddleware.js";

const router = express.Router();

// router.post("/analyze", analyzeRepo);

router.post("/",protect,analyzeRepo)
router.get("/history",protect,getUserHistory)

export default router;