// services/repoService.js

import simpleGit from "simple-git";
import path from "path";

export const cloneRepo = async (repoUrl) => {
  const git = simpleGit();

  const repoName = repoUrl.split("/").pop().replace(".git", "");
  const clonePath = path.join("tempRepos", repoName);

  await git.clone(repoUrl, clonePath);

  return clonePath;
};