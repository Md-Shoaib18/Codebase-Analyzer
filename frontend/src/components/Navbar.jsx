// src/components/Navbar.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Code2, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Code2 className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">Codebase Analyzer</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;