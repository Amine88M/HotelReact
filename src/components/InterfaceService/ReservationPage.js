import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {}; // Récupérer le service sélectionné

  const [roomNumber, setRoomNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]); // État pour stocker les chambres disponibles
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Récupérer les chambres disponibles depuis l'API
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/chambre/disponibles');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des chambres disponibles');
        }
        const data = await response.json();
        setAvailableRooms(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, []);

  const handleReservation = async () => {
    // Vérifier si tous les champs sont remplis
    if (!roomNumber || !date || !time) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    // Vérifier si la date est antérieure à la date actuelle
    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date de réservation ne peut pas être antérieure à la date actuelle.',
      });
      return;
    }

    // Préparer les données pour l'API
    const requestData = {
      NumChambre: parseInt(roomNumber, 10),
      ServiceId: service.Id_Service, // ID du service sélectionné
      DateService: selectedDate,
      Heure: time,
      Quantite: 1, // Quantité par défaut
    };

    try {
      // Appeler l'API pour associer le service à la chambre
      const response = await fetch('https://localhost:7141/api/ConsommationService/AssociateServiceToRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation du service.');
      }

      // Afficher un message de succès
      Swal.fire({
        icon: 'success',
        title: 'Réservation confirmée',
        text: `Le service ${service.Nom_Service} a été réservé pour la chambre ${roomNumber}.`,
      }).then(() => {
        // Rediriger vers une page de confirmation ou autre
        navigate('/confirmation');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la réservation du service.',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des chambres disponibles...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Réservation: {service?.Nom_Service}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro de chambre</label>
          <select
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez une chambre</option>
            {availableRooms.map((room) => (
              <option key={room.NumChambre} value={room.NumChambre}>
                {room.NumChambre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de réservation</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Heure de réservation</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleReservation}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Confirmer la réservation
        </button>
      </div>
    </div>
  );
}