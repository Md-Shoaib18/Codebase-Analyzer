import { cloneRepo } from "../services/repoService";
import { scanFiles } from "../services/scanService";

export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    const repoPath = await cloneRepo(repoUrl);

    const files = scanFiles(repoPath);


    res.json({ 
        totalFiles: files.length,
        files: files.slice(0, 10)
     });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};