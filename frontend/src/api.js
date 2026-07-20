import axios from 'axios';

const api = axios.create({
  // Dynamically points to the backend port on whichever IP you are viewing from
  baseURL: `http://${window.location.hostname}:5000/api`,
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
