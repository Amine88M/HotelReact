import React, { useEffect, useState } from 'react';
import TodayReservations from './TodayReservations';

export default function Dashboard() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/reservations'); // Remplacez par l'URL de votre API
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        const data = await response.json();

        // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Calculer les valeurs pour les cartes
        setTotalGuests(data.length); // Nombre total de réservations

        // Calculer le nombre de chambres disponibles (exemple : 50 chambres au total)
        const totalRooms = 50; // Remplacez par le nombre total de chambres dans votre hôtel
        const occupiedRooms = data.filter(reservation => {
          const checkInDate = reservation.dateCheckIn.split('T')[0];
          const checkOutDate = reservation.dateCheckOut.split('T')[0];
          return today >= checkInDate && today <= checkOutDate;
        }).length;
        setAvailableRooms(totalRooms - occupiedRooms);

        // Calculer le nombre de réservations avec une date de check-in aujourd'hui
        const todayCheckInReservations = data.filter(reservation => {
          const checkInDate = reservation.dateCheckIn.split('T')[0];
          return checkInDate === today;
        });
        setTodayCheckIns(todayCheckInReservations.length);

        // Calculer le nombre de réservations avec une date de check-out aujourd'hui
        const todayCheckOutReservations = data.filter(reservation => {
          const checkOutDate = reservation.dateCheckOut.split('T')[0];
          return checkOutDate === today;
        });
        setTodayCheckOuts(todayCheckOutReservations.length);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Carte : Total Guests */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Guests</h3>
        <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
      </div>

      {/* Carte : Available Rooms */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Available Rooms</h3>
        <p className="text-2xl font-bold text-gray-900">{availableRooms}</p>
      </div>

      {/* Carte : Today's Check-ins */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Check-ins</h3>
        <p className="text-2xl font-bold text-gray-900">{todayCheckIns}</p>
      </div>

      {/* Carte : Today's Check-outs */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Check-outs</h3>
        <p className="text-2xl font-bold text-gray-900">{todayCheckOuts}</p>
      </div>

      {/* Tableau des réservations */}
      <div className="col-span-full">
        <TodayReservations />
      </div>
    </div>
  );
}