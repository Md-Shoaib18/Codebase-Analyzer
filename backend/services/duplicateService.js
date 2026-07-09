import fs from "fs"
import crypto from "crypto"

export const detectDuplicates = (files,windowSize=6)=>{
    const blockMap=new Map();
    const duplicates = [];

    files.forEach(filePath=>{
        const code=fs.readFileSync(filePath,'utf-8');
        const lines=code.split("\n");

        for(let i=0;i<=lines.length-windowSize;i++){
            const block=lines.slice(i,i+windowSize).join('\n');
            const normalizedBlock=block.replace(/\s+/g,' ');
            if(normalizedBlock.length<30)continue;

            const hash=crypto.createHash('md5').update(normalizedBlock).digest('hex');
            if(!blockMap.has(hash)){
                blockMap.set(hash,[]);
            } 

            blockMap.get(hash).push({
                file:filePath, 
                startLine:i+1,
                endLine:i+windowSize
            });


        }
    })

    for(const [hash,occurrences] of blockMap.entries()){
        if(occurrences.length>1){
            const uniqueFiles=new Set(occurrences.map(o=>o.file));
            if(uniqueFiles.size>1){
                duplicates.push({occurrences})
            }
        }
    }
    return duplicates.slice(0,5);
}