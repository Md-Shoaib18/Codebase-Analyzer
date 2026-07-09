// src/pages/Register.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await register(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register account');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <Code2 className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an Account</h2>
                    <p className="mt-2 text-sm text-gray-600">Start analyzing your codebases</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
                    <div className="space-y-4">
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Create Account <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </form>
                
                <div className="text-center text-sm mt-4">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;