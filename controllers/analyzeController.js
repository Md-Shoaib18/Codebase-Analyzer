import { cloneRepo } from "../services/repoService.js";
import { scanFiles } from "../services/scanService.js";
import { analyzeComplexity } from "../services/complexityService.js";
import { generateInsights } from "../services/insightService.js";
import { deleteRepo } from "../services/deleteService.js";


const analyzeRepo = async (req, res) => {
  let repoPath = null;

  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    //Clone
   repoPath = await cloneRepo(repoUrl);

    //Scan
    const files = scanFiles(repoPath);

    //Analyze Complexity
    const rawResults = files.map((file) => analyzeComplexity(file));

    const cleanedResults = rawResults.map(result=>({
      ...result,
      file:result.file.replace(repoPath,"").replace(/^[\\\/]+/,"").replace(/\\/g,"/")
    }))

    const insights = generateInsights(cleanedResults);

    res.json({
        status: "success", 
        totalFiles: files.length,
        // files : rawResults.map(result=>({
        //   ...result,
        //   file:result.file.replace(repoPath,"").replace(/^[\\\/]+/,"").replace(/\\/g,"/")
        // })),
        analysis:cleanedResults.slice(0,10),
        averageComplexity: insights.averageComplexity,
        mostComplexFile: insights.mostComplexFile,
        topComplexFiles: insights.topComplexFiles
     });

  } catch (error) {
    console.error("Error analyzing repo:", error);
    return res.status(500).json({ 
      success:'false',
      message: "Server error during analysis" 
    });
  } 
  // finally {
  //   console.log('Cleaning up...');
  //   if(repoPath){
  //     deleteRepo(repoPath);
  //     console.log(`Successfully deleted repo at ${repoPath}`);
  //   }
  // }
};

export {
  analyzeRepo
};