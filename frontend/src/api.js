import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend base URL
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The backend auth middleware expects x-auth-token header
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
