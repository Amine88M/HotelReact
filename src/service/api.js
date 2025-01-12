import axios from 'axios';

const API_URL = 'https://localhost:7141/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reservationService = {
  getAllReservations: () => api.get('/reservations'),
  deleteSelectedReservations: (ids) => api.post('/reservations/deleteselected', ids),
  getReservationDetails: (id) => api.get(`/reservations/${id}`),
  createReservation: (data) => api.post('/reservations', data),
  getRoomTypes: () => api.get('/reservations/RoomTypes'),
  cancelReservation: (id) => api.post('/reservations/annulerreservation', id),
};

export default api;