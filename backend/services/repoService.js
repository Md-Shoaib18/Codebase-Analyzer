// services/repoService.js

import simpleGit from "simple-git";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import crypto from "crypto";

export const cloneRepo = async (repoUrl) => {

  const hash= crypto.createHash("md5").update(repoUrl).digest("hex");
  const repoDir= path.join(process.cwd(),"tempRepos",hash);

  if(fs.existsSync(repoDir)){
    console.log(`Cache hit for ${repoUrl}, using existing repo`);
    return repoDir;
  }
  console.log(`Cloning ${repoUrl} into ${repoDir}...`);
  try{
    execSync(`git clone ${repoUrl} ${repoDir}`, { stdio: "ignore" });
    return repoDir;
  }catch(err){
    console.error(`Error cloning ${repoUrl}:`, err);
    throw new Error("Failed to clone repository");
  }
};