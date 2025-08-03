// src/services/api.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL: `${apiUrl}/`,
  //baseURL: 'https://localhost:7055/',
});

api.interceptors.request.use((config) => {
    console.log("interceptado");
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;