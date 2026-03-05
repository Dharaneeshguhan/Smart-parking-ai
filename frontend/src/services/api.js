import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

export const parkingAPI = {
  searchParking: (searchData) => api.post('/parking/search', searchData),
  searchParkingByTime: (searchData) => api.get('/parking/search', { params: searchData }),
  getParkingDetails: (id) => api.get(`/parking/${id}`),
  bookParking: (bookingData) => api.post('/bookings', bookingData),
  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  getMyBookings: () => api.get('/bookings/my'),
  getFavorites: () => api.get('/parking/favorites'),
  addToFavorites: (parkingId) => api.post(`/parking/${parkingId}/favorite`),
  removeFromFavorites: (parkingId) => api.delete(`/parking/${parkingId}/favorite`),
  getPaymentHistory: () => api.get('/bookings/payments'),
  getNearbyParking: (lat, lng) => api.get('/parking/nearby', { params: { lat, lng } }),
  getUnavailableTimeRanges: (slotId) => api.get(`/parking/slots/${slotId}/unavailable-times`),
  downloadReceipt: (paymentId) => api.get(`/bookings/payments/${paymentId}/receipt`, {
    responseType: 'blob'
  }),
};

export const ownerAPI = {
  getParkingSlots: () => api.get('/owner/slots'),
  addParkingSlot: (slotData) => api.post('/owner/slots', slotData),
  updateParkingSlot: (id, slotData) => api.put(`/owner/slots/${id}`, slotData),
  deleteParkingSlot: (id) => api.delete(`/owner/slots/${id}`),
  getBookings: () => api.get('/owner/bookings'),
  getEarnings: (params) => api.get('/owner/earnings', { params }),
  getAnalytics: () => api.get('/owner/analytics'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getDemandPrediction: () => api.get('/dashboard/demand-prediction'),
  getAvailabilityChart: () => api.get('/dashboard/availability'),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

export default api;
