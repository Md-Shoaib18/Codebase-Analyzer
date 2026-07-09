import { ArrowLeft, AlertTriangle, FileCode2, Copy, Activity, Package, List } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ReportView = ({ analysis, onBack }) => {
    const scanDate = new Date(analysis.createdAt).toLocaleString();
    const repoName = analysis.repoUrl.replace('https://github.com/', '');

    // Format chart data
    const chartData = analysis.topComplexFiles?.length > 0 
        ? analysis.topComplexFiles.map(file => ({
            name: file.file.split('/').pop(),
            score: file.score
          }))
        : [{ name: 'Average', score: analysis.averageComplexity }];

    return (
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
                <div>
                    <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 break-all">{repoName}</h2>
                    <p className="text-sm text-gray-500">Scanned on {scanDate}</p>
                </div>
                
                {/* Tech Stack Badges */}
                {analysis.projectSetup?.isNodeProject && (
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        <span className="flex items-center px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-medium">
                            <Package className="w-3 h-3 mr-1" /> Node.js
                        </span>
                        {analysis.projectSetup.topDependencies?.map(dep => (
                            <span key={dep} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                                {dep}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md"><FileCode2 className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Files</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.totalFiles}</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start space-x-4">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-md"><Copy className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Duplicate Blocks</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.duplicates?.length || 0}</p>
                    </div>
                </div>
                <div className={`p-4 rounded-lg border flex items-start space-x-4 ${analysis.securityIssues?.length > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                    <div className={`p-2 rounded-md ${analysis.securityIssues?.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Security Issues</p>
                        <p className={`text-2xl font-bold ${analysis.securityIssues?.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                            {analysis.securityIssues?.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Layout Grid: Chart on Left, Tables on Right (or stacked on mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Complexity Chart */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-500" /> Top 5 Most Complex Files
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11}} truncateByClip={true} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Tables */}
                <div className="flex flex-col space-y-8 overflow-hidden">
                    
                    {/* Security Audit Table (Only shows if issues exist) */}
                    {analysis.securityIssues?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" /> Security Vulnerabilities
                            </h3>
                            <div className="overflow-x-auto rounded-lg border border-red-200">
                                <table className="min-w-full divide-y divide-red-200">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">File</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Line</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analysis.securityIssues.map((issue, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{issue.type}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-37.5" title={issue.file}>{issue.file.split('/').pop()}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{issue.line}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* General File Analysis Table (The raw array) */}
                    {analysis.analysis?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <List className="w-5 h-5 mr-2 text-gray-500" /> Deep File Analysis
                            </h3>
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Path</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analysis.analysis.slice(0, 5).map((file, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-50" title={file.file}>{file.file}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-blue-600">{file.score || file.complexity || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ReportView;