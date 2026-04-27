import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getMeAPI = () => API.get('/auth/me');
export const updateProfileAPI = (data) => API.put('/auth/updateprofile', data);

// Helpers
export const getHelpersAPI = (params) => API.get('/helpers', { params });
export const getHelperByIdAPI = (id) => API.get(`/helpers/${id}`);
export const getMyHelperProfileAPI = () => API.get('/helpers/my/profile');
export const createHelperProfileAPI = (data) => API.post('/helpers/profile', data);
export const updateHelperProfileAPI = (data) => API.put('/helpers/profile', data);

// Bookings
export const createBookingAPI = (data) => API.post('/bookings', data);
export const getMyBookingsAPI = () => API.get('/bookings/my');
export const getHelperBookingsAPI = () => API.get('/bookings/helper');
export const updateBookingStatusAPI = (id, data) => API.put(`/bookings/${id}/status`, data);
export const getAllBookingsAPI = (params) => API.get('/bookings', { params });

// Reviews
export const createReviewAPI = (data) => API.post('/reviews', data);
export const getHelperReviewsAPI = (helperId) => API.get(`/reviews/helper/${helperId}`);

// Admin
export const getAdminStatsAPI = () => API.get('/admin/stats');
export const getAllHelpersAdminAPI = (params) => API.get('/admin/helpers', { params });
export const verifyHelperAPI = (id, status) => API.put(`/admin/helpers/${id}/verify`, { status });
export const getAllUsersAdminAPI = () => API.get('/admin/users');
export const toggleUserStatusAPI = (id) => API.put(`/admin/users/${id}/toggle`);
export const getComplaintsAPI = () => API.get('/admin/complaints');
export const resolveComplaintAPI = (id, notes) => API.put(`/admin/complaints/${id}/resolve`, { notes });

export default API;
