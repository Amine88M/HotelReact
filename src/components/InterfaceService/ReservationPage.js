import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Styles du calendrier
import { FaBed, FaCalendarAlt, FaClock } from 'react-icons/fa'; // Icônes
import { setMinutes, format } from 'date-fns'; // Pour générer les minutes

export default function ReservationPage() {
  const location = useLocation();
  const { service } = location.state || {}; // Récupérer le service sélectionné

  const [roomNumber, setRoomNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date sélectionnée
  const [selectedHour, setSelectedHour] = useState(''); // Heure sélectionnée
  const [selectedMinute, setSelectedMinute] = useState(''); // Minute sélectionnée
  const [availableRooms, setAvailableRooms] = useState([]); // État pour stocker les numéros de chambre disponibles
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Générer les heures de 7h à 22h
  const hours = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));

  // Générer les minutes spécifiques
  const generateSpecificMinutes = () => {
    const specificMinutes = [0, 1, 3, 4, 20, 30, 45]; // Minutes spécifiques
    return specificMinutes.map((minute) => format(setMinutes(new Date(), minute), 'mm'));
  };

  const minutes = generateSpecificMinutes(); // ['00', '01', '03', '04', '20', '30', '45']

  // Récupérer les chambres disponibles depuis l'API
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/service/chambres-disponibles');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des chambres disponibles');
        }
        const data = await response.json();
        console.log("Données reçues :", data); // Afficher les données dans la console
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
    // Combiner l'heure et les minutes sélectionnées
    const time = `${selectedHour}:${selectedMinute}`;

    // Vérifier si tous les champs sont remplis
    if (!roomNumber || !selectedDate || !selectedHour || !selectedMinute) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    // Vérifier si la date est antérieure à la date actuelle
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
      DateService: selectedDate.toISOString(), // Convertir la date en format ISO
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
        text: `Le service ${service.Nom_Service} a été réservé pour la chambre ${roomNumber} à ${time}.`,
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
        {/* Sélection du numéro de chambre */}
        <div>
          <div className="flex items-center space-x-2">
            <FaBed className="text-gray-500" />
            <label className="block text-sm font-medium text-gray-700">Numéro de chambre</label>
          </div>
          <select
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez une chambre</option>
            {availableRooms.map((roomNum) => (
              <option key={roomNum} value={roomNum}>
                {roomNum}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection de la date */}
        <div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <label className="block text-sm font-medium text-gray-700">Date de réservation</label>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sélection de l'heure et des minutes */}
        <div>
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-500" />
            <label className="block text-sm font-medium text-gray-700">Heure de réservation</label>
          </div>
          <div className="flex space-x-2 mt-1">
            {/* Sélecteur d'heures */}
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Heure</option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>

            {/* Sélecteur de minutes */}
            <select
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Minute</option>
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de confirmation */}
        <button
          onClick={handleReservation}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Confirmer la réservation
        </button>
      </div>
    </div>
  );
}