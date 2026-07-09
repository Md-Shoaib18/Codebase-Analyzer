// src/components/ReportView.jsx
import { ArrowLeft, AlertTriangle, FileCode2, Copy, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ReportView = ({ analysis, onBack }) => {
    // Format the date nicely
    const scanDate = new Date(analysis.createdAt).toLocaleString();
    const repoName = analysis.repoUrl.replace('https://github.com/', '');

    // Prepare data for the complexity chart
    const chartData = [
        { name: 'Average File', score: analysis.averageComplexity },
        { name: 'Most Complex File', score: analysis.mostComplexFile?.score || 0 }
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                    <button 
                        onClick={onBack}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">{repoName}</h2>
                    <p className="text-sm text-gray-500">Scanned on {scanDate}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold border border-blue-100">
                    Analysis Report
                </div>
            </div>

            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md"><FileCode2 className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Files Scanned</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.totalFiles}</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start space-x-4">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-md"><Copy className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Duplicate Blocks</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.duplicateInstances}</p>
                    </div>
                </div>
                <div className={`p-4 rounded-lg border flex items-start space-x-4 ${analysis.securityIssues > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                    <div className={`p-2 rounded-md ${analysis.securityIssues > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Security Issues</p>
                        <p className={`text-2xl font-bold ${analysis.securityIssues > 0 ? 'text-red-700' : 'text-green-700'}`}>
                            {analysis.securityIssues}
                        </p>
                    </div>
                </div>
            </div>

            {/* Complexity Chart Section */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Complexity Analysis
                </h3>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">Most Complex File: </span> 
                            {analysis.mostComplexFile?.file || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportView;