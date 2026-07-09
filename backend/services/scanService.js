// services/scanService.js

import fs from "fs";
import path from "path";

const IGNORED_FOLDERS = ["node_modules", ".git", "tests", "__tests__"];
const VALID_EXTENSIONS = [".js", ".ts", ".jsx", ".tsx"];

export const scanFiles = (dirPath, fileList = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORED_FOLDERS.includes(file)) {
        scanFiles(fullPath, fileList);
      }
    } else {
      const ext = path.extname(fullPath);
      if (VALID_EXTENSIONS.includes(ext)) {
        if(!file.includes(".test") && !file.includes(".spec")
            && !file.includes(".config") && !file.includes(".d.ts")) {
        fileList.push(fullPath);
      }
    }
    }
  });

  return fileList;
};