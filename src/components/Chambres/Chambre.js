import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Chambre() {
  const navigate = useNavigate();
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);

  // Mapping pour les types de chambre
  const typesChambres = {
    1: 'Simple',
    2: 'Double',
    3: 'Suite',
  };

  // Mapping pour les statuts
  const etatChambreMapping = {
    0: 'Disponible',
    1: 'Occupée',
    2: 'En maintenance',
    3: 'Réservée',
  };

  // Récupérer les chambres depuis l'API
  useEffect(() => {
    const fetchChambres = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/chambre');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log(data); // Log pour vérifier les données reçues
        setChambres(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de charger les chambres. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        setLoading(false);
      }
    };

    fetchChambres();
  }, []);

  // Filtrer les chambres en fonction du terme de recherche
  const filteredChambres = chambres.filter((chambre) => {
    const searchText = searchTerm.toLowerCase();
    return (
      chambre.numChambre.toString().includes(searchText) || // Recherche par numéro de chambre
      typesChambres[chambre.id_Type_Chambre]?.toLowerCase().includes(searchText) || // Recherche par type de chambre
      etatChambreMapping[chambre.etatChambre]?.toLowerCase().includes(searchText) // Recherche par statut
    );
  });

  // Trier les chambres
  const sortedChambres = [...filteredChambres].sort((a, b) => {
    if (sortBy === 'type') {
      return typesChambres[a.id_Type_Chambre]?.localeCompare(typesChambres[b.id_Type_Chambre]);
    } else if (sortBy === 'statut') {
      return etatChambreMapping[a.etatChambre]?.localeCompare(etatChambreMapping[b.etatChambre]);
    }
    return 0; // Pas de tri
  });

  // Gérer la sélection/désélection des chambres
  const handleRowCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  // Supprimer les chambres sélectionnées
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        title: 'Aucune sélection',
        text: 'Veuillez sélectionner au moins une chambre à supprimer.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera les chambres sélectionnées !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('https://localhost:7141/api/chambre/deleteselected', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedIds),
          });

          if (response.ok) {
            setChambres((prevChambres) =>
              prevChambres.filter((chambre) => !selectedIds.includes(chambre.numChambre))
            );
            setSelectedIds([]);
            Swal.fire('Supprimé !', 'Les chambres sélectionnées ont été supprimées.', 'success');
          } else {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP : ${response.status} - ${errorText}`);
          }
        } catch (error) {
          console.error('Erreur:', error);
          Swal.fire('Erreur !', error.message || 'Une erreur s\'est produite lors de la suppression.', 'error');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Liste des Chambres</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher par numéro, type ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSortBy('type')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            Trier par Type
          </button>
          <button
            onClick={() => setSortBy('statut')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'statut' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            Trier par Statut
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer la sélection
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-700">Chargement...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="w-12 px-3 py-3 text-left"></th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro de Chambre
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Chambre
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedChambres.map((chambre) => (
                <tr key={chambre.numChambre} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(chambre.numChambre)}
                      onChange={() => handleRowCheckboxChange(chambre.numChambre)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-9 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chambre.numChambre}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typesChambres[chambre.id_Type_Chambre] || 'Inconnu'}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {etatChambreMapping[chambre.etatChambre]}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chambre.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}