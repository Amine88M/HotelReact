import React, { useState, useEffect } from 'react';
import { FaCar, FaSpa, FaUtensils, FaParking, FaDumbbell, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ReserverServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupérer les services depuis l'API au chargement du composant
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/service');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des services');
        }
        const data = await response.json();
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
    PARKING: <FaParking className="text-blue-600" />,
    DEFAULT: <FaQuestionCircle className="text-gray-600" />,
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  if (services.length === 0) {
    return <div className="text-center py-8">Aucun service disponible.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {services.map((service) => (
        <div key={service.id_Service} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {serviceIcons[service.nom_Service?.toUpperCase()] || serviceIcons.DEFAULT}{" "}
            {service.nom_Service || "Nom du service non disponible"}
          </h2>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex-1">
              <p className="text-gray-600">{service.description || "Description non disponible"}</p>
              <p className="text-gray-800 font-semibold mt-2">Tarif: MAD {service.tarif || "N/A"}</p>
            </div>
            <button
              onClick={() => navigate('reservation', { state: { service } })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}