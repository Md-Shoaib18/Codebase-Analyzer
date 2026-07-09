// import fs from "fs";

// export const deleteRepo = async (repoPath) => {
//     console.log("Deleting repo at:", repoPath);
//     try{
//     await fs.promises.rm(repoPath,{
//     recursive: true,
//     force: true
//     });
//     console.log(`Successfully deleted ${repoPath}`);
//     }catch(err){
//         console.error(`Error deleting ${repoPath}:`, err);
//     }
// };

import fs from "fs";

export const deleteRepo = (repoPath) => {
    try {
        // rmSync halts the thread and guarantees deletion before moving on
        fs.rmSync(repoPath, { 
            recursive: true, 
            force: true 
        });
    } catch (err) {
        console.error(`Error deleting ${repoPath}:`, err);
    }
};