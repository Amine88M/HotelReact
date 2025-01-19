import React, { useState } from 'react';
import { FaCar, FaSpa, FaUtensils } from 'react-icons/fa';

export default function ReserverServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);

  const handleReserveClick = async (service) => {
    setSelectedService(service);
  };

  const handleCheckAvailability = async () => {
    const response = await fetch('https://localhost:7141/api/service/CheckAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id_Service: selectedService.Id_Service,
        DateDebut: new Date(dateDebut),
        DateFin: new Date(dateFin),
      }),
    });

    const data = await response.json();
    setIsAvailable(data);
  };

  const handleReserve = async () => {
    const response = await fetch('https://localhost:7141/api/service/Reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id_Service: selectedService.Id_Service,
        Id_Sejour: '123', // Remplacez par l'ID du séjour
        Id_Utilisateur: '456', // Remplacez par l'ID de l'utilisateur connecté
        DateDebut: new Date(dateDebut),
        DateFin: new Date(dateFin),
      }),
    });

    if (response.ok) {
      alert('Service réservé avec succès !');
    } else {
      alert('Erreur lors de la réservation du service.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Réserver Services</h1>

      {/* Section Taxi */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaCar className="text-blue-600" /> TAXI
        </h2>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-600">
              Réservez un transport rapide et accès fiable pour vos déplacements en ville ou pour rejoindre l'aéroport.
            </p>
            <p className="text-gray-800 font-semibold mt-2">Trajet en ville: MAD 100</p>
          </div>
          <button
            onClick={() => handleReserveClick({ Id_Service: 1, Nom_Service: 'TAXI' })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Réserver maintenant
          </button>
        </div>
      </div>

      {/* Section SPA */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaSpa className="text-green-600" /> SPA
        </h2>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-600">
              Détendez-vous avec des massages relaxants, soins du visage et accès à des équipements modernes.
            </p>
            <p className="text-gray-800 font-semibold mt-2">Séance de 60min: MAD 300</p>
          </div>
          <button
            onClick={() => handleReserveClick({ Id_Service: 2, Nom_Service: 'SPA' })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Réserver maintenant
          </button>
        </div>
      </div>

      {/* Section Restauration */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaUtensils className="text-orange-600" /> Restauration
        </h2>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex-1">
            <p className="text-gray-600">
              Profitez d'une cuisine raffinée avec des plats préparés par des chefs expérimentés.
            </p>
            <p className="text-gray-800 font-semibold mt-2">1 personne: MAD 150</p>
          </div>
          <button
            onClick={() => handleReserveClick({ Id_Service: 3, Nom_Service: 'Restauration' })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Réserver maintenant
          </button>
        </div>
      </div>

      {/* Interface de réservation */}
      {selectedService && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Réserver {selectedService.Nom_Service}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date et heure de début</label>
              <input
                type="datetime-local"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date et heure de fin</label>
              <input
                type="datetime-local"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleCheckAvailability}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Vérifier la disponibilité
            </button>
            {isAvailable !== null && (
              <p className="text-sm text-gray-600">
                {isAvailable ? 'Disponible' : 'Non disponible pour cette période.'}
              </p>
            )}
            {isAvailable && (
              <button
                onClick={handleReserve}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Confirmer la réservation
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}