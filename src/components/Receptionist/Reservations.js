import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeOptions, setShowTypeOptions] = useState(false); // Pour afficher/masquer les options de type
  const [showStatutOptions, setShowStatutOptions] = useState(false); // Pour afficher/masquer les options de statut
  const [selectedType, setSelectedType] = useState(null); // Pour stocker le type sélectionné
  const [selectedStatut, setSelectedStatut] = useState(null); // Pour stocker le statut sélectionné
  const [infoMessage, setInfoMessage] = useState(null); // Pour afficher un message d'information

  const typesChambres = {
    1: "Simple",
    2: "Double",
    3: "Suite",
    4:"Familiale"
  };

  const statutsReservation = {
    "reserved": "Réservée",
    "checked-in": "Checked-in",
    "cancelled": "Annulée",
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

  // Filtrer les réservations en fonction du terme de recherche, du type et du statut
  const filteredReservations = reservations.filter((reservation) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      reservation.id.toString().includes(searchText) ||
      reservation.nom.toLowerCase().includes(searchText) ||
      reservation.prenom.toLowerCase().includes(searchText);

    const matchesType = selectedType ? reservation.id_Type_Chambre === selectedType : true;
    const matchesStatut = selectedStatut ? reservation.statut === selectedStatut : true;

    return matchesSearch && matchesType && matchesStatut;
  });

  // Afficher un message d'information temporaire
  const showTemporaryMessage = (message) => {
    setInfoMessage(message);
    setTimeout(() => {
      setInfoMessage(null);
    }, 3000); // Le message disparaît après 3 secondes
  };

  // Vérifier si aucune réservation ne correspond aux critères
  useEffect(() => {
    if (filteredReservations.length === 0 && (selectedType || selectedStatut || searchTerm)) {
      const typeLabel = selectedType ? typesChambres[selectedType] : null;
      const statutLabel = selectedStatut ? statutsReservation[selectedStatut] : null;

      if (typeLabel && statutLabel) {
        showTemporaryMessage(`Aucune réservation de type "${typeLabel}" et de statut "${statutLabel}".`);
      } else if (typeLabel) {
        showTemporaryMessage(`Aucune réservation de type "${typeLabel}".`);
      } else if (statutLabel) {
        showTemporaryMessage(`Aucune réservation avec le statut "${statutLabel}".`);
      } else if (searchTerm) {
        showTemporaryMessage(`Aucune réservation ne correspond à la recherche "${searchTerm}".`);
      }
    }
  }, [filteredReservations, selectedType, selectedStatut, searchTerm]);

  // Rediriger vers la page de création de réservation
  const handleCreateReservation = () => {
    navigate('/Receptionist/create-reservation');
  };

  // Rediriger vers la page de détails d'une réservation
  const handleViewReservationDetails = (reservationId) => {
    navigate(`/receptionist/details/${reservationId}`);
  };
  // Réinitialiser les filtres
  /*const resetFilters = () => {
    setSelectedType(null);
    setSelectedStatut(null);
    setSearchTerm('');
  };*/

  // Gérer la sélection/désélection des réservations
  const handleRowCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  // Supprimer les réservations sélectionnées
  const handleDeleteSelected = () => {
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
        // Demander le mot de passe
        const { value: password } = await Swal.fire({
          title: 'Authentification requise',
          text: 'Veuillez entrer le mot de passe pour confirmer la suppression',
          input: 'password',
          inputPlaceholder: 'Entrez le mot de passe',
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#d33',
          preConfirm: (inputPassword) => {
            if (inputPassword === '123Abc') {
              return inputPassword;
            }
            Swal.showValidationMessage('Mot de passe incorrect');
            return false;
          }
        });

        if (password) {
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
      }
    });
  };

  // Annuler une réservation
  const handleCancelReservation = async (id) => {
    try {
      // Trouver la réservation correspondante
      const reservation = reservations.find(r => r.id === id);
  
      // Vérifier si la date de check-in est aujourd'hui
      const today = new Date();
      const checkInDate = new Date(reservation.dateCheckIn);
  
      // Comparer les dates en ignorant l'heure
      if (
        checkInDate.getFullYear() === today.getFullYear() &&
        checkInDate.getMonth() === today.getMonth() &&
        checkInDate.getDate() === today.getDate()
      ) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible d\'annuler une réservation prévue pour aujourd\'hui.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        return;
      }
  
      // Vérifier si la réservation est déjà annulée
      if (reservation.statut === "Annulée") {
        Swal.fire({
          title: 'Information',
          text: 'Cette réservation est déjà annulée.',
          icon: 'info',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
  
      // Première confirmation avec texte à saisir
      const firstConfirm = await Swal.fire({
        title: 'Attention!',
        text: 'Écrivez "ANNULER" en majuscules pour confirmer',
        input: 'text',
        inputPlaceholder: 'ANNULER',
        showCancelButton: true,
        confirmButtonText: 'Continuer',
        cancelButtonText: 'Retour',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        inputValidator: (value) => {
          if (value !== 'ANNULER') {
            return 'Veuillez écrire exactement "ANNULER"';
          }
        }
      });
  
      if (!firstConfirm.isConfirmed) {
        return;
      }
  
      // Deuxième confirmation finale
      const finalConfirm = await Swal.fire({
        title: 'Dernière vérification',
        text: "Cette action est irréversible. Êtes-vous absolument sûr de vouloir annuler cette réservation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, annuler définitivement',
        cancelButtonText: 'Non, retour'
      });
  
      if (!finalConfirm.isConfirmed) {
        return;
      }
  
      // Procéder à l'annulation
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

          <div className="relative">
            <button
              onClick={() => {
                setShowTypeOptions(!showTypeOptions);
                setShowStatutOptions(false); // Masquer les options de statut si elles sont ouvertes
              }}
              className={`px-4 py-2 text-sm font-medium ${
                selectedType ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Trier par Type de Chambre
            </button>
            {showTypeOptions && (
              <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {Object.entries(typesChambres).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedType(Number(key));
                      setShowTypeOptions(false); // Masquer les options après sélection
                    }}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowStatutOptions(!showStatutOptions);
                setShowTypeOptions(false); // Masquer les options de type si elles sont ouvertes
              }}
              className={`px-4 py-2 text-sm font-medium ${
                selectedStatut ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Trier par Statut
            </button>
            {showStatutOptions && (
              <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {Object.entries(statutsReservation).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedStatut(key);
                      setShowStatutOptions(false); // Masquer les options après sélection
                    }}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Réinitialiser
          </button> */}

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              selectedIds.length === 0 
                ? 'bg-red-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 mr-2 ${
                selectedIds.length === 0 ? 'text-gray-400' : 'text-white'
              }`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Supprimer la sélection
          </button>
        </div>
      </div>

      {/* Message d'information temporaire */}
      {infoMessage && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Nombre de résultats */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredReservations.length} réservation(s) trouvée(s)
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
              {filteredReservations.map((reservation) => (
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
                    {statutsReservation[reservation.statut] || reservation.statut}
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