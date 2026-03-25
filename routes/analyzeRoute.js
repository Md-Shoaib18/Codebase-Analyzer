// routes/analyzeRoute.js
import express from "express";
import { analyzeRepo } from "../controllers/analyzeController.js";

const router = express.Router();

router.post("/analyze", analyzeRepo);

export default router;