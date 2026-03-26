// services/repoService.js

import simpleGit from "simple-git";
import path from "path";

const basePath = path.resolve("tempRepos");

export const cloneRepo = async (repoUrl) => {
  const git = simpleGit();

  const repoName = repoUrl.split("/").pop().replace(".git", "");
  const clonePath = path.join(basePath, repoName);

  await git.clone(repoUrl, clonePath);

  return clonePath;
};