// src/api/axiosConfig.js
import axios from 'axios';

// Create a custom axios instance pointing to your backend
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// This "interceptor" runs right before every request is sent
API.interceptors.request.use(
    (config) => {
        // Look in the browser's local storage for the token
        const token = localStorage.getItem('token');
        
        // If it exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;