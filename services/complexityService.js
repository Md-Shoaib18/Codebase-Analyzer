import fs from "fs";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

export const analyzeComplexity = (filePath) => {
    const content=fs.readFileSync(filePath, "utf-8");

    const lines= content.split("\n").length;

    let loop=0;
    let classes=0;
    let functions=0;
    let maxNestingDepth=0;

    try{
        const ast=parser.parse(content,{
            sourceType:'module',
            plugins:['typescript','jsx']
        })

        traverse(ast,{
            enter(path){
                let depth=0;
                let currentPAth=path;
                while(currentPAth.parentPath){
                    if(currentPAth.isBlockStatement())depth++;
                    currentPAth=currentPAth.parentPath;
                }
                maxNestingDepth=Math.max(maxNestingDepth,depth);
            },
            ClassDeclaration(){classes++;},
            FunctionDeclaration(){functions++;},
            ArrowFunctionExpression(){functions++;},
            ForStatement(){loop++;},
            WhileStatement(){loop++;},
            DoWhileStatement(){loop++;},
            ForInStatement(){loop++;},
            ForOfStatement(){loop++;}
        });
    }catch(err){
        console.error(`Error parsing ${filePath}.Skipping deep analysis`);
    }

    // const arrowFunctions = (content.match(/=>/g) || []).length;
    // const functionCount = (content.match(/\bfunction\b/g) || []).length + arrowFunctions;

    // const forCount= (content.match(/\bfor\b/g) || []).length;
    // const whileCount= (content.match(/\bwhile\b/g) || []).length;
    const ifCount= (content.match(/\bif\b/g) || []).length;
    const elseCount= (content.match(/\belse\b/g) || []).length;

    // const loops = forCount + whileCount;
    const conditionals = ifCount + elseCount;

    const score = (functions * 10)+ (loop * 15) +(conditionals*3) + (maxNestingDepth*20) + (classes*10);

    return {
        file: filePath,
        lines,
        functionCount: functions,
        classes,
        loops: loop,
        conditionals,
        maxNestingDepth,
        score
    }
};
