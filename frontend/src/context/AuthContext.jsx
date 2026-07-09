// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig'; // The file we created earlier

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // When the app loads, check if they already have a token
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await API.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser({ token: res.data.token, email: res.data.email });
            navigate('/dashboard'); // Send them to the dashboard!
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const res = await API.post('/users/register', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser({ token: res.data.token, email: res.data.email });
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};