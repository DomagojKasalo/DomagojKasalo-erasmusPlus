import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (loginData) => api.post('/users/login', loginData);
