import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ReceptionDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      const response = await axios.get("https://localhost:7141/api/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  };

  // Handle checkbox select/deselect
  const handleRowSelect = (id) => {
    setSelectedReservations((prev) =>
      prev.includes(id)
        ? prev.filter((reservationId) => reservationId !== id)
        : [...prev, id]
    );
  };

  // Handle select/deselect all rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReservations(reservations.map((r) => r.id));
    } else {
      setSelectedReservations([]);
    }
  };

  // Delete selected reservations
  const handleDeleteSelected = async () => {
    if (selectedReservations.length === 0) {
      Swal.fire("Erreur", "Aucune réservation sélectionnée !", "error");
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera les réservations sélectionnées !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("https://localhost:7141/api/reservations/deleteselected", selectedReservations);
          Swal.fire("Supprimé !", "Les réservations sélectionnées ont été supprimées.", "success");
          fetchReservations(); // Refresh reservations
          setSelectedReservations([]);
        } catch (error) {
          console.error("Erreur lors de la suppression des réservations :", error);
          Swal.fire("Erreur !", "Une erreur s'est produite lors de la suppression.", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      {/* Page Title */}
      <div className="text-center mb-4">
        <h1 className="text-success" style={{ fontWeight: "bold" }}>
          Liste des Réservations
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <a href="/reservations/create" className="btn btn-success px-4">
          Ajouter une Réservation
        </a>
        <button
          id="delete-selected-btn"
          className="btn btn-danger px-4"
          disabled={selectedReservations.length === 0}
          onClick={handleDeleteSelected}
        >
          Supprimer la sélection
        </button>
      </div>

      {/* Reservations Table */}
      <table className="table table-striped shadow-sm">
        <thead className="table-dark">
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
            <tr key={reservation.id} data-id={reservation.id}>
              <td>
                <input
                  type="checkbox"
                  className="select-row"
                  checked={selectedReservations.includes(reservation.id)}
                  onChange={() => handleRowSelect(reservation.id)}
                />
              </td>
              <td>{reservation.nom}</td>
              <td>{reservation.prenom}</td>
              <td>{new Date(reservation.dateReservation).toLocaleDateString()}</td>
              <td>{new Date(reservation.dateCheckIn).toLocaleDateString()}</td>
              <td>{new Date(reservation.dateCheckOut).toLocaleDateString()}</td>
              <td>
                <a
                  href={`/reservations/details/${reservation.id}`}
                  className="btn btn-sm btn-info text-white"
                  style={{ fontWeight: "bold" }}
                >
                  Détails
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <footer className="border-top text-muted mt-5 pt-3">
        <div className="text-center">
          &copy; 2024 - GestionReservation -{" "}
          <a href="/privacy" className="text-success">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ReceptionDashboard;
