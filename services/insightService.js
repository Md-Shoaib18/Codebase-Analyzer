
export const generateInsights = (analysisResults) => {
    if(!analysisResults || analysisResults.length === 0) {
        return{
            averageComplexity: 0,
            mostComplexFile: null,
            topComplexFiles: []
        };
    }

    const totalComplexity = analysisResults.reduce((sum, file) => sum + file.score, 0);
    const averageComplexity = Number((totalComplexity / analysisResults.length).toFixed(2));

    const sortedFiles = [...analysisResults].sort((a, b) => b.score - a.score);

    const topComplexFiles = sortedFiles.slice(0,3).map(item =>({
        file: item.file,
        score: item.score
     }));
     const mostComplexFile = topComplexFiles.length > 0 ? topComplexFiles[0].file : null;

     return {
        averageComplexity,
        mostComplexFile,
        topComplexFiles
     };
}