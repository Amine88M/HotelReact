import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CreateChambre() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numChambre: '',
    id_Type_Chambre: '',
    etatChambre: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7141/api/chambre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
      }

      // Afficher un message de succès
      Swal.fire({
        title: 'Succès !',
        text: 'La chambre a été créée avec succès.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });

      // Rediriger vers la liste des chambres
      navigate('/chambres');
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        title: 'Erreur !',
        text: error.message || 'Une erreur s\'est produite lors de la création de la chambre.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Créer une nouvelle chambre</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Numéro de chambre */}
          <div>
            <label htmlFor="numChambre" className="block text-sm font-medium text-gray-700">
              Numéro de chambre
            </label>
            <input
              type="text"
              id="numChambre"
              name="numChambre"
              value={formData.numChambre}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type de chambre */}
          <div>
            <label htmlFor="id_Type_Chambre" className="block text-sm font-medium text-gray-700">
              Type de chambre
            </label>
            <select
              id="id_Type_Chambre"
              name="id_Type_Chambre"
              value={formData.id_Type_Chambre}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="1">Simple</option>
              <option value="2">Double</option>
              <option value="3">Suite</option>
              <option value="4">Familiale</option>
            </select>
          </div>

          {/* État de la chambre */}
          <div>
            <label htmlFor="etatChambre" className="block text-sm font-medium text-gray-700">
              État de la chambre
            </label>
            <select
              id="etatChambre"
              name="etatChambre"
              value={formData.etatChambre}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un état</option>
              <option value="0">Disponible</option>
              <option value="1">Occupée</option>
              <option value="2">En maintenance</option>
              <option value="3">Réservée</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Créer la chambre
          </button>
        </div>
      </form>
    </div>
  );
}