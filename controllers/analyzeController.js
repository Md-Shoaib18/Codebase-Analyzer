import { cloneRepo } from "../services/repoService.js";
import { scanFiles } from "../services/scanService.js";
import { analyzeComplexity } from "../services/complexityService.js";


const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    //Clone
    const repoPath = await cloneRepo(repoUrl);

    //Scan
    const files = scanFiles(repoPath);

    //Analyze Complexity
    const results = files.map((file) => analyzeComplexity(file));

    res.json({
        status: "success", 
        totalFiles: files.length,
        files: files.slice(0, 10),
        analysis: results.slice(0,5)
     });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export {
  analyzeRepo
};