import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}token/`, { username, password });
    if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        // We'll also need to decode the token or hit a /me endpoint to get the role
    }
    return response.data;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};