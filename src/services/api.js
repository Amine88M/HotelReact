import axios from 'axios';

export const reservationService = {
  getAllReservations: () => {
    return axios.get('/Receptionist/reservations');
  },

  deleteSelectedReservations: (ids) => {
    return axios.post('/Reservations/DeleteSelected', ids, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  cancelReservation: (id) => {
    return axios.post(`/Reservations/Cancel/${id}`);
  }
}; 