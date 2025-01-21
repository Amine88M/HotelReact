import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaCar, FaSpa, FaUtensils, FaParking, FaQuestionCircle, FaDumbbell, FaTag, FaAlignLeft, FaMoneyBill, FaCheckCircle } from 'react-icons/fa';

export default function CreateService() {
  const [nomService, setNomService] = useState('');
  const [description, setDescription] = useState('');
  const [tarif, setTarif] = useState('');
  const [disponibilite, setDisponibilite] = useState(true); // true = Disponible, false = Indisponible
  const [selectedIcon, setSelectedIcon] = useState('DEFAULT');
  const [loading, setLoading] = useState(false);

  const serviceIcons = {
    TAXI: <FaCar className="text-blue-600" />,
    SPA: <FaSpa className="text-green-600" />,
    RESTAURATION: <FaUtensils className="text-orange-600" />,
    PARKING: <FaParking className="text-purple-600" />,
    GYM: <FaDumbbell className="text-red-600" />,
    DEFAULT: <FaQuestionCircle className="text-gray-600" />,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomService || !description || !tarif) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newService = {
      Nom_Service: nomService,
      Description: description,
      Tarif: parseFloat(tarif),
      Disponibilité: disponibilite, // Booléen (true ou false)
      Icon: selectedIcon,
    };

    setLoading(true);

    try {
      const response = await fetch('https://localhost:7141/api/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Succès !',
          text: 'Le service a été créé avec succès.',
          icon: 'success',
          confirmButtonColor: '#8CD4B9',
        }).then(() => {
          // Réinitialiser le formulaire
          setNomService('');
          setDescription('');
          setTarif('');
          setDisponibilite(true); // Réinitialiser à "Disponible"
          setSelectedIcon('DEFAULT');
        });
      } else {
        throw new Error('Erreur lors de la création du service.');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erreur !',
        text: error.message || 'Une erreur s\'est produite lors de la création du service.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Créer un nouveau service</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaTag className="text-blue-600" />
            Nom du service
          </label>
          <input
            type="text"
            value={nomService}
            onChange={(e) => setNomService(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaAlignLeft className="text-blue-600" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaMoneyBill className="text-blue-600" />
            Tarif
          </label>
          <input
            type="number"
            value={tarif}
            onChange={(e) => setTarif(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          
         
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Création en cours...' : 'Créer le service'}
          </button>
        </div>
      </form>
    </div>
  );
}