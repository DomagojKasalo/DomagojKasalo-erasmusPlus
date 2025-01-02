import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Presretač za dodavanje tokena u zaglavlja zahtjeva
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (loginData) => api.post('/users/login', loginData);

export default api;
