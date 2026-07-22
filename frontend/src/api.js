import axios from 'axios';

const api = axios.create({
  // Point to the global localtunnel backend
  baseURL: `https://kamma-backend-939.loca.lt/api`,
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The backend auth middleware expects x-auth-token header
      config.headers['x-auth-token'] = token;
    }
    // Bypass localtunnel warning screen for API requests
    config.headers['Bypass-Tunnel-Reminder'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
