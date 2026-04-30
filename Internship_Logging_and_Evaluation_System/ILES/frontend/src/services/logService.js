import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
});

export const getLogs = async () => {
    const response = await axios.get(`${API_URL}logs/`, authHeaders());
    return response.data;
};

export const createLog = async (data) => {
    const response = await axios.post(`${API_URL}logs/`, data, authHeaders());
    return response.data;
};

export const updateLog = async (id, data) => {
    const response = await axios.patch(`${API_URL}logs/${id}/`, data, authHeaders());
    return response.data;
};

export const submitLog = async (id) => {
    const response = await axios.post(`${API_URL}logs/${id}/submit/`, {}, authHeaders());
    return response.data;
};

export const recallLog = async (id) => {
    const response = await axios.post(`${API_URL}logs/${id}/recall/`, {}, authHeaders());
    return response.data;
};