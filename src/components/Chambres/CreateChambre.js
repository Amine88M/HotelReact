import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { MdBed, MdDescription, MdBuild, MdCheckCircle } from 'react-icons/md';

export default function CreateChambre() {
  const [formData, setFormData] = useState({
    Id_Type_Chambre: '', // ID du type de chambre (avec underscore)
    description: '', // Description de la chambre
    etatChambre: '', // État de la chambre (par défaut : chaîne vide)
  });

  // Mapping des types de chambre
  const typesChambres = [
    { id: 1, label: 'Simple' },
    { id: 2, label: 'Double' },
    { id: 3, label: 'Suite' },
    { id: 4, label: 'Familiale' },
  ];

  // Mapping des états de chambre
  const etatsChambre = [
    { value: 0, label: 'Disponible' },
    { value: 2, label: 'En maintenance' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'etatChambre' || name === 'Id_Type_Chambre' ? parseInt(value, 10) : value,
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
      }).then(() => {
        // Rafraîchir la page après la confirmation de l'utilisateur
        window.location.reload();
      });
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
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        {/* <MdBed className="mr-2 text-3xl text-blue-600" /> */}
        Créer une nouvelle chambre
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Type de chambre */}
          <div>
            <label htmlFor="Id_Type_Chambre" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdBed className="mr-2 text-xl text-blue-500" />
              Type de chambre
            </label>
            <select
              id="Id_Type_Chambre"
              name="Id_Type_Chambre"
              value={formData.Id_Type_Chambre}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">Sélectionnez un type</option>
              {typesChambres.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* État de la chambre */}
          <div>
            <label htmlFor="etatChambre" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdBuild className="mr-2 text-xl text-blue-500" />
              État de la chambre
            </label>
            <select
              id="etatChambre"
              name="etatChambre"
              value={formData.etatChambre}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">Sélectionnez l'état de la chambre</option>
              {etatsChambre.map((etat) => (
                <option key={etat.value} value={etat.value}>
                  {etat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MdDescription className="mr-2 text-xl text-blue-500" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            <MdCheckCircle className="mr-2 text-xl" />
            Créer la chambre
          </button>
        </div>
      </form>
    </div>
  );
}