import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ReceptionDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("https://localhost:7141/api/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedReservations((prev) =>
      prev.includes(id)
        ? prev.filter((reservationId) => reservationId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReservations(reservations.map((r) => r.id));
    } else {
      setSelectedReservations([]);
    }
  };

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
          fetchReservations();
          setSelectedReservations([]);
        } catch (error) {
          console.error("Erreur lors de la suppression des réservations :", error);
          Swal.fire("Erreur !", "Une erreur s'est produite lors de la suppression.", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">
          Liste des Réservations
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <a href="/reservations/create" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Ajouter une Réservation
        </a>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
          disabled={selectedReservations.length === 0}
          onClick={handleDeleteSelected}
        >
          Supprimer la sélection
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={handleSelectAll}
                  checked={selectedReservations.length === reservations.length && reservations.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date de Réservation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date d'Arrivée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date de Départ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedReservations.includes(reservation.id)}
                    onChange={() => handleRowSelect(reservation.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{reservation.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reservation.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.dateReservation).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.dateCheckIn).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(reservation.dateCheckOut).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/reservations/details/${reservation.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Détails
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="border-t mt-8 pt-4 text-center text-gray-600">
        <div>
          &copy; 2024 - GestionReservation -{" "}
          <a href="/privacy" className="text-green-600 hover:text-green-700">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ReceptionDashboard;