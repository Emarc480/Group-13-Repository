import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}auth/login/`, { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        // We'll also need to decode the token or hit a /me endpoint to get the role
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}auth/register/`, userData);
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};