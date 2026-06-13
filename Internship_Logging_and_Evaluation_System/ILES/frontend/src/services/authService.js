import axios from 'axios';

const API_URL = 'https://iles-backend-4lkx.onrender.com/api/';

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}auth/login/`, { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

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

export const getMe = async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}auth/me/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};