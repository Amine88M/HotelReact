import React from 'react';
import ReservationItem from './ReservationItem';

const ReservationList = ({ reservations = [], selectedReservations = [], setSelectedReservations }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = reservations.map((reservation) => reservation.id);
      setSelectedReservations(allIds);
    } else {
      setSelectedReservations([]);
    }
  };

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              id="select-all"
              onChange={handleSelectAll}
              checked={selectedReservations.length === reservations.length && reservations.length > 0}
            />
          </th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Date de Réservation</th>
          <th>Date d'Arrivée (Check-In)</th>
          <th>Date de Départ (Check-Out)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => (
          <ReservationItem
            key={reservation.id}
            reservation={reservation}
            isSelected={selectedReservations.includes(reservation.id)}
            setSelectedReservations={setSelectedReservations}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ReservationList;