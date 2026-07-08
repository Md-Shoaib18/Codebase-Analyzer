import { cloneRepo } from "../services/repoService.js";
import { scanFiles } from "../services/scanService.js";
import { analyzeComplexity } from "../services/complexityService.js";
import { generateInsights } from "../services/insightService.js";
import { detectDuplicates } from "../services/duplicateService.js";
import { analyzeDependencies } from "../services/dependencyService.js"; // 1. Import it

const analyzeRepo = async (req, res) => {
  let repoPath = null;

  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    // Clone
    repoPath = await cloneRepo(repoUrl);

    // 2. Analyze Dependencies (Do this before scanning all files)
    const dependencyInfo = analyzeDependencies(repoPath);

    // Scan
    const files = scanFiles(repoPath);

    // Analyze Complexity
    const rawResults = files.map((file) => analyzeComplexity(file));
    const cleanedResults = rawResults.map(result => ({
      ...result,
      file: result.file.replace(repoPath, "").replace(/^[\\\/]+/, "").replace(/\\/g, "/")
    }));

    // Generate Insights & Duplicates
    const insights = generateInsights(cleanedResults);
    const rawDuplicates = detectDuplicates(files);
    
    const cleanedDuplicates = rawDuplicates.map(duplicate => ({
        ...duplicate,
        occurrences: duplicate.occurrences.map(occ => ({
            ...occ,
            file: occ.file.replace(repoPath, "").replace(/^[\\\/]+/, "").replace(/\\/g, "/")
        }))
    }));

    // 3. Add to Final Response
    res.json({
        status: "success", 
        projectSetup: dependencyInfo, // <-- Added here
        totalFiles: files.length,
        analysis: cleanedResults.slice(0, 10),
        averageComplexity: insights.averageComplexity,
        mostComplexFile: insights.mostComplexFile,
        topComplexFiles: insights.topComplexFiles,
        duplicates: cleanedDuplicates 
     });

  } catch (error) {
    console.error("Error analyzing repo:", error);
    return res.status(500).json({ 
      success: 'false',
      message: "Server error during analysis" 
    });
  } 
};

export { analyzeRepo };