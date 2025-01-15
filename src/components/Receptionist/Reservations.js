import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);

  const typesChambres = {
    1: "Simple",
    2: "Double",
    3: "Suite",
  };

  // Récupérer les réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/reservations');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de charger les réservations. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtrer les réservations en fonction du terme de recherche
  const filteredReservations = reservations.filter((reservation) => {
    const searchText = searchTerm.toLowerCase();
    return (
      reservation.id.toString().includes(searchText) ||
      reservation.nom.toLowerCase().includes(searchText) ||
      reservation.prenom.toLowerCase().includes(searchText)
    );
  });

  // Trier les réservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortBy === 'typeChambre') {
      return typesChambres[a.id_Type_Chambre].localeCompare(typesChambres[b.id_Type_Chambre]);
    } else if (sortBy === 'statut') {
      if (a.statut === "reserved" && b.statut !== "reserved") {
        return -1; // "Reserved" vient en premier
      } else if (b.statut === "reserved" && a.statut !== "reserved") {
        return 1; // "Reserved" vient en premier
      } else {
        return a.statut.localeCompare(b.statut);
      }
    }
    return 0; // Pas de tri
  });

  // Rediriger vers la page de création de réservation
  const handleCreateReservation = () => {
    navigate('/reservations/create-form');
  };

  // Rediriger vers la page de détails d'une réservation
  const handleViewReservationDetails = (id) => {
    navigate(`/reservations/${id}`);
  };

  // Gérer la sélection/désélection des réservations
  const handleRowCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  // Supprimer les réservations sélectionnées
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        title: 'Aucune sélection',
        text: 'Veuillez sélectionner au moins une réservation à supprimer.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Confirmer la suppression
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera les réservations sélectionnées !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('https://localhost:7141/api/reservations/deleteselected', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedIds),
          });

          if (response.ok) {
            setReservations((prevReservations) =>
              prevReservations.filter((reservation) => !selectedIds.includes(reservation.id))
            );
            setSelectedIds([]);
            Swal.fire('Supprimé !', 'Les réservations sélectionnées ont été supprimées.', 'success');
          } else {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
          }
        } catch (error) {
          console.error('Erreur:', error);
          Swal.fire('Erreur !', error.message || 'Une erreur s\'est produite lors de la suppression.', 'error');
        }
      }
    });
  };

  // Annuler une réservation
  const handleCancelReservation = async (id) => {
    try {
      const response = await fetch(`https://localhost:7141/api/reservations/annulerreservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(id),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'annulation de la réservation');
      }

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id ? { ...reservation, statut: "Annulée" } : reservation
        )
      );

      Swal.fire({
        title: 'Succès!',
        text: 'La réservation a été annulée avec succès.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        title: 'Erreur!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Liste des Réservations</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher par numéro, nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSortBy('typeChambre')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'typeChambre' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            Trier par Type de Chambre
          </button>
          <button
            onClick={() => setSortBy('statut')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'statut' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            Trier par Statut
          </button>
          <button
            onClick={handleCreateReservation}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Ajouter une Réservation
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer la sélection
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-700">Chargement...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="w-12 px-3 py-3 text-left"></th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro de Réservation
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prénom
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'Arrivée
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de Départ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Chambre
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-11 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(reservation.id)}
                      onChange={() => handleRowCheckboxChange(reservation.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-9 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.nom}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.prenom}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(reservation.dateCheckIn).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(reservation.dateCheckOut).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typesChambres[reservation.id_Type_Chambre] || "Inconnu"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.statut}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewReservationDetails(reservation.id)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium mr-2"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Annuler
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}