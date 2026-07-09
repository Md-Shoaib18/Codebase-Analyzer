// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import Navbar from '../components/Navbar';
import { Search, GitBranch, Clock, Activity, CheckCircle, Trash2 } from 'lucide-react';
import ReportView from '../components/ReportView';

const Dashboard = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [history, setHistory] = useState([]);
    const [loadingJob, setLoadingJob] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState('');
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);

    // Fetch history on initial load
    useEffect(() => {
        fetchHistory();
    }, []);

    // THE MAGIC POLLING HOOK
    useEffect(() => {
        let interval;
        if (currentJobId) {
            interval = setInterval(async () => {
                try {
                    const res = await API.get(`/analyze/status/${currentJobId}`);
                    setJobStatus(res.data.status); // 'waiting', 'active', or 'completed'

                    if (res.data.status === 'completed') {
                        clearInterval(interval);
                        setCurrentJobId(null);
                        setLoadingJob(false);
                        fetchHistory(); // Refresh the sidebar with the new scan!
                    } else if (res.data.status === 'failed') {
                        clearInterval(interval);
                        setCurrentJobId(null);
                        setLoadingJob(false);
                        setJobStatus('failed');
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
            }, 2000); // Ask the server every 2 seconds
        }
        return () => clearInterval(interval); // Cleanup when component unmounts
    }, [currentJobId]);

    const fetchHistory = async () => {
        try {
            const res = await API.get('/analyze/history');
            setHistory(res.data.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!repoUrl) return;

        setLoadingJob(true);
        setJobStatus('initializing');
        try {
            const res = await API.post('/analyze', { repoUrl });
            setCurrentJobId(res.data.jobId);
            setRepoUrl(''); // Clear input bar
        } catch (error) {
            console.error("Analysis failed to start", error);
            setLoadingJob(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevents the click from opening the report
        
        // Quick native browser confirmation
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await API.delete(`/analyze/${id}`);
                
                // Remove it from the sidebar visually without reloading the page
                setHistory(history.filter(item => item._id !== id));
                
                // If they just deleted the report they are currently looking at, close it
                if (selectedAnalysis?._id === id) {
                    setSelectedAnalysis(null);
                }
            } catch (error) {
                console.error("Failed to delete report", error);
                alert("Failed to delete the report.");
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                
                {/* LEFT SIDEBAR: History */}
                <div className="w-1/3 flex flex-col space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-2 mb-4 text-gray-800 font-semibold">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <h3>Scan History</h3>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-150 pr-2">
                            {history.length === 0 ? (
                                <p className="text-sm text-gray-500">No past scans found.</p>
                            ) : (
                                history.map((item) => (
                                    <div 
                                        key={item._id} 
                                        onClick={() => setSelectedAnalysis(item)} 
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors group relative ${
                                            selectedAnalysis?._id === item._id 
                                            ? 'bg-blue-50 border-blue-200' 
                                            : 'border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-gray-900 truncate pr-6 group-hover:text-blue-600">
                                                {item.repoUrl.replace('https://github.com/', '')}
                                            </p>
                                            <button 
                                                onClick={(e) => handleDelete(e, item._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 absolute right-3 top-3 flex-shrink-0"
                                                title="Delete Report"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                                            <span>Files: {item.totalFiles}</span>
                                            <span className={item.securityIssues?.length > 0 || item.securityIssues > 0 ? "text-red-500 font-medium" : "text-green-500"}>
                                                Issues: {Array.isArray(item.securityIssues) ? item.securityIssues.length : (item.securityIssues || 0)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="w-2/3 flex flex-col space-y-6">
                    {/* CONDITIONAL RENDERING: Show Report if selected, otherwise show Search */}
                    {selectedAnalysis ? (
                        <ReportView 
                            analysis={selectedAnalysis} 
                            onBack={() => setSelectedAnalysis(null)} 
                        />
                    ) : (
                        <>
                            {/* Input Form */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze a Repository</h2>
                                <p className="text-gray-500 mb-6">Enter a public GitHub URL to run a deep static analysis, detect duplicate code, and find security vulnerabilities.</p>
                                
                                <form onSubmit={handleAnalyze} className="flex gap-4">
                                    <div className="relative grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <GitBranch className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="url"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="https://github.com/expressjs/express"
                                            value={repoUrl}
                                            onChange={(e) => setRepoUrl(e.target.value)}
                                            disabled={loadingJob}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loadingJob}
                                        className="inline-flex items-center px-6 py-3 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                    >
                                        <Search className="w-5 h-5 mr-2" />
                                        {loadingJob ? 'Queuing...' : 'Scan'}
                                    </button>
                                </form>
                            </div>

                            {/* Dynamic Polling Status Banner */}
                            {loadingJob && (
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
                                        <span className="text-blue-800 font-medium">
                                            Worker Status: <span className="uppercase font-bold">{jobStatus}</span>
                                        </span>
                                    </div>
                                    <span className="text-sm text-blue-600">Parsing ASTs & Scanning Secrets...</span>
                                </div>
                            )}
                            
                            {jobStatus === 'completed' && !loadingJob && (
                                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="text-green-800 font-medium">Analysis Complete! Check your history panel.</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;