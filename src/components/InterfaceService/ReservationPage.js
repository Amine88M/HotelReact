import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBed, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { format, startOfDay, isBefore } from 'date-fns';

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {}; // Récupérer le service sélectionné

  const [roomNumber, setRoomNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rediriger si aucun service n'est sélectionné
  useEffect(() => {
    if (!service) {
      navigate('/receptionist/reserver-services');
    }
  }, [service, navigate]);

  // Générer les heures de 7h à 22h
  const hours = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));

  // Générer les minutes par intervalles de 5 minutes
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  // Récupérer les chambres disponibles depuis l'API
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/service/chambres-disponibles');
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
    if (!roomNumber || !selectedDate || !selectedHour || !selectedMinute || !quantity) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    const currentDate = new Date();
    const selectedDateOnly = startOfDay(selectedDate);
    const currentDateOnly = startOfDay(currentDate);

    if (isBefore(selectedDateOnly, currentDateOnly)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date de réservation ne peut pas être antérieure à la date actuelle.',
      });
      return;
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const time = `${selectedHour}:${selectedMinute}:00`;

    const requestData = {
      NumChambre: parseInt(roomNumber, 10),
      ServiceId: service.id_Service,
      DateService: formattedDate,
      Heure: time,
      Quantite: quantity,
    };

    try {
      const response = await fetch('https://localhost:7141/api/ConsommationService/AssociateServiceToRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réservation du service.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Réservation confirmée',
        text: `Le service ${service.nom_Service} a été réservé pour la chambre ${roomNumber} à ${time}.`,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la réservation du service.',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des chambres disponibles...</div>;
  }

  if (availableRooms.length === 0) {
    return <div className="text-center py-8">Aucune chambre disponible.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Réservation: {service?.nom_Service}</h2>
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
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Heure</option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}h
                </option>
              ))}
            </select>

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

        {/* Sélection de la quantité */}
        <div>
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700">Quantité</label>
          </div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
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