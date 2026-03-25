import fs from "fs";

export const analyzeComplexity = (filePath) => {
    const content=fs.readFileSync(filePath, "utf-8");

    const lines= content.split("\n").length;

    const arrowFunctions = (content.match(/=>/g) || []).length;
    const functionCount = (content.match(/\bfunction\b/g) || []).length + arrowFunctions;

    const forCount= (content.match(/\bfor\b/g) || []).length;
    const whileCount= (content.match(/\bwhile\b/g) || []).length;
    const ifCount= (content.match(/\bif\b/g) || []).length;
    const elseCount= (content.match(/\belse\b/g) || []).length;

    const loops = forCount + whileCount;
    const conditionals = ifCount + elseCount;

    const score = lines+ functionCount * 5 +conditionals*3 + loops*4;

    return {
        file: filePath,
        lines,
        functionCount,
        conditionals,
        loops,
        score
    }
};
