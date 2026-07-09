// services/dependencyService.js
import fs from 'fs';
import path from 'path';

export const analyzeDependencies = (repoPath) => {
    const packageJsonPath = path.join(repoPath, 'package.json');
    
    // If it's not a Node.js project, handle it gracefully
    if (!fs.existsSync(packageJsonPath)) {
        return { 
            isNodeProject: false, 
            message: "No package.json found" 
        };
    }

    try {
        const rawData = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageData = JSON.parse(rawData);
        
        const dependencies = packageData.dependencies || {};
        const devDependencies = packageData.devDependencies || {};
        
        const depCount = Object.keys(dependencies).length;
        const devDepCount = Object.keys(devDependencies).length;

        return {
            isNodeProject: true,
            projectName: packageData.name || 'Unnamed Project',
            totalDependencies: depCount + devDepCount,
            productionDependencies: depCount,
            devDependencies: devDepCount,
            // Returning the top 5 dependencies so the JSON payload doesn't get massive
            topDependencies: Object.keys(dependencies).slice(0, 5) 
        };
    } catch (error) {
        console.error(`Error parsing package.json at ${repoPath}:`, error.message);
        return { 
            isNodeProject: false, 
            message: "Failed to parse package.json" 
        };
    }
};