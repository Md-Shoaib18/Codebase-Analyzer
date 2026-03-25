import fs from "fs";

export const analyzeComplexity = (filePath) => {
    const content=fs.readFileSync(filePath, "utf-8");

    const lines= content.split("\n").length;

    const arrowFunctions = (content.match(/=>/g) || []).length;
    const functionCount = (content.match(/\bfunction\b/g) || []).length + arrowFunctions;

    const ifCount= (content.match(/\bif\b/g) || []).length;

    const score = lines+ functionCount * 5 +ifCount*2;


    return {
        file: filePath,
        lines,
        functionCount,
        ifCount,
        score
    }
};
