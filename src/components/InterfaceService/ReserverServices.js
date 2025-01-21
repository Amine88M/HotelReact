import React, { useState, useEffect } from 'react';
import { FaCar, FaSpa, FaUtensils, FaParking, FaDumbbell, FaQuestionCircle } from 'react-icons/fa';

export default function ReserverServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les services depuis l'API au chargement du composant
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/service');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des services');
        }
        const data = await response.json();
        console.log("Services récupérés :", data); // Afficher les données dans la console
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Mapper les noms de services aux icônes correspondantes
  const serviceIcons = {
    TAXI: <FaCar className="text-blue-600" />,
    SPA: <FaSpa className="text-green-600" />,
    RESTAURATION: <FaUtensils className="text-orange-600" />,
    GYM: <FaDumbbell className="text-red-600" />,
    PARKING: <FaParking className="text-blue-600" />, // Icône pour le parking
    DEFAULT: <FaQuestionCircle className="text-gray-600" />, // Icône par défaut
  };

  // Afficher un indicateur de chargement pendant la récupération des données
  if (loading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  // Afficher un message si aucun service n'est disponible
  if (services.length === 0) {
    return <div className="text-center py-8">Aucun service disponible.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Consulter Services</h1>

      {/* Afficher dynamiquement les services */}
      {services.map((service) => (
        <div key={service.id_Service} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {serviceIcons[service.nom_Service?.toUpperCase()] || serviceIcons.DEFAULT}{" "}
            {service.nom_Service || "Nom du service non disponible"} {/* Afficher un message par défaut si le nom est manquant */}
          </h2>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
              <p className="text-gray-600">{service.description || "Description non disponible"}</p>
              <p className="text-gray-800 font-semibold mt-2">Tarif: MAD {service.tarif || "N/A"}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Interface de réservation */}
      {selectedService && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {serviceIcons[selectedService.nom_Service?.toUpperCase()] || serviceIcons.DEFAULT}{" "}
            {selectedService.nom_Service}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de réservation</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure de réservation</label>
              <input
                type="time"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                // Logique pour réserver le service
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}