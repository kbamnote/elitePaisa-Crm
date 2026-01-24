import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://elite-paisa-backend-production.up.railway.app/api', // Elite Paisa backend base URL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      Cookies.remove('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    // Remove token from cookies
    Cookies.remove('adminToken');
    // Optionally call backend logout endpoint if available
    // return api.post('/auth/logout');
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
  }
};

// Loan Applications API
export const loanApplicationsAPI = {
  getAll: (params) => api.get('/loan-applications', { params }),
  getById: (id) => api.get(`/loan-applications/${id}`),
  updateStatus: (id, statusData) => api.patch(`/loan-applications/${id}/status`, statusData),
};

// Loan Types API
export const loanTypesAPI = {
  getAll: (params) => {
    console.log('Fetching loan types with params:', params);
    return api.get('/loan-types', { params });
  },
  create: (data) => {
    console.log('Creating loan type with data:', data);
    return api.post('/loan-types', data);
  },
  update: (id, data) => {
    console.log('Updating loan type:', id, 'with data:', data);
    return api.put(`/loan-types/${id}`, data);
  },
  delete: (id) => {
    console.log('Deleting loan type:', id);
    return api.delete(`/loan-types/${id}`);
  },
};

// Customers API
export const customersAPI = {
  getAll: (params) => api.get('/profile/all', { params }),
  getById: (id) => api.get(`/profile/detail/${id}`),
  delete: (id) => {
    console.log('Making DELETE request to:', `/profile/${id}`);
    return api.delete(`/profile/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentApplications: (params) => api.get('/dashboard/recent-applications', { params }),
  getApplicationsByStatus: () => api.get('/dashboard/applications-by-status'),
  getApplicationsByLoanType: () => api.get('/dashboard/applications-by-loan-type'),
  getMonthlyTrends: (params) => api.get('/dashboard/monthly-trends', { params }),
};

export default api;