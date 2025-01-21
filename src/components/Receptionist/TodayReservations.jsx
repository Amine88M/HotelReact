import React, { useEffect, useState } from 'react';

export default function TodayReservations() {
  const [reservations, setReservations] = useState([]);
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

        // Filtrer les réservations pour n'afficher que celles avec une date de check-in aujourd'hui
        const todayCheckInReservations = data.filter(reservation => {
          const checkInDate = reservation.dateCheckIn.split('T')[0]; // Extraire uniquement la date (sans l'heure)
          return checkInDate === today; // Comparer uniquement la date de check-in
        });

        setReservations(todayCheckInReservations);
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
    <div className="w-auto bg-white shadow-md rounded-lg overflow-hidden max-w-full">
      <div className="px-6 py-4 bg-blue-600">
        <h2 className="text-xl font-bold text-white">Today's Check-in Reservations</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number of Adults</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number of Children</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reservation.nom} {reservation.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.dateCheckIn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.dateCheckOut).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.nombreAdults}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.nombreEnfants}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}