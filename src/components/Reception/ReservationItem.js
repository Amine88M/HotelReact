import React from 'react';

const ReservationItem = ({ reservation, isSelected, setSelectedReservations }) => {
  const handleSelect = (e) => {
    if (e.target.checked) {
      setSelectedReservations((prev) => [...prev, reservation.id]);
    } else {
      setSelectedReservations((prev) => prev.filter((id) => id !== reservation.id));
    }
  };

  return (
    <tr data-id={reservation.id}>
      <td>
        <input
          type="checkbox"
          className="select-row"
          checked={isSelected}
          onChange={handleSelect}
        />
      </td>
      <td>{reservation.Nom}</td>
      <td>{reservation.Prenom}</td>
      <td>{reservation.DateReservation.toLocaleDateString()}</td>
      <td>{reservation.DateCheckIn.toLocaleDateString()}</td>
      <td>{reservation.DateCheckOut.toLocaleDateString()}</td>
      <td>
        <a className="btn btn-sm btn-primary" href={`/reservations/details/${reservation.id}`}>
          Détails
        </a>
      </td>
    </tr>
  );
};

export default ReservationItem;