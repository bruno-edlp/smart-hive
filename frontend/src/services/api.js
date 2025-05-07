import axios from 'axios';

const api = axios.create({
  baseURL: 'http://168.231.96.176:5000/api'
});

// Add interceptors to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;