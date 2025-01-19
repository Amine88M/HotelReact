import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roles, setRoles] = useState([]);

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://localhost:7141/api/admin/users?page=${currentPage}`);
        let userData = [];
        
        if (Array.isArray(response.data)) {
          userData = response.data;
          setTotalPages(1);
        } else if (response.data.users) {
          userData = response.data.users;
          setTotalPages(response.data.totalPages || 1);
        }

        // Tri par défaut par nom
        const sortedData = userData.sort((a, b) => a.nom.localeCompare(b.nom));
        setUsers(sortedData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setError('Erreur lors du chargement des utilisateurs.');
      }
    };

    fetchUsers();
  }, [currentPage]);

  // Ajouter un useEffect pour charger les rôles depuis l'API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://localhost:7141/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des rôles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Fonction de tri
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedUsers = [...users].sort((a, b) => {
      if (field === 'role') {
        return newDirection === 'asc' 
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else {
        return newDirection === 'asc'
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });
    setUsers(sortedUsers);
  };

  // Supprimer les utilisateurs sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      Swal.fire({
        title: 'Aucune sélection',
        text: 'Veuillez sélectionner au moins un utilisateur à supprimer.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Première confirmation
    const firstConfirm = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera les utilisateurs sélectionnés !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });

    if (firstConfirm.isConfirmed) {
      // Demande du mot de passe
      const passwordCheck = await Swal.fire({
        title: 'Vérification de sécurité',
        text: 'Veuillez saisir le mot de passe de confirmation',
        input: 'password',
        inputPlaceholder: 'Mot de passe',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        inputValidator: (value) => {
          if (!value) {
            return 'Veuillez saisir le mot de passe';
          }
        }
      });

      if (passwordCheck.isConfirmed) {
        // Vérification du mot de passe
        if (passwordCheck.value === '123Abc') {
          try {
            const response = await fetch('https://localhost:7141/api/admin/deleteselectedusers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(selectedUsers)
            });

            if (response.ok) {
              setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
              setSelectedUsers([]);
              Swal.fire('Supprimé !', 'Les utilisateurs sélectionnés ont été supprimés.', 'success');
            } else {
              throw new Error('Erreur lors de la suppression');
            }
          } catch (error) {
            console.error('Erreur:', error);
            Swal.fire('Erreur !', error.message || 'Une erreur s\'est produite lors de la suppression.', 'error');
          }
        } else {
          // Mot de passe incorrect - Déconnexion
          await Swal.fire({
            title: 'Mot de passe incorrect',
            text: 'Vous allez être déconnecté pour des raisons de sécurité.',
            icon: 'error',
            confirmButtonColor: '#d33',
            allowOutsideClick: false
          });
          
          // Déconnexion
          localStorage.clear(); // Effacer toutes les données de session
          navigate('/login'); // Redirection vers la page de login
        }
      }
    }
  };

  // Filtrer les utilisateurs en fonction du terme de recherche et du rôle
  const filteredUsers = users.filter((user) => {
    const searchMatch = 
      user.userName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    
    const roleMatch = roleFilter === 'all' || 
      user.role?.toLowerCase() === roleFilter.toLowerCase();
    
    return searchMatch && roleMatch;
  });

  // Trier les utilisateurs filtrés
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (roleFilter) {
      return a.role.toLowerCase().localeCompare(b.role.toLowerCase());
    }
    return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase());
  });

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="px-4 py-2 border rounded-lg flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors ${
              selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
          >
            Supprimer la sélection
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 border-b">
                Sélection
              </th>
              <th 
                className="px-6 py-3 border-b text-left cursor-pointer"
                onClick={() => handleSort('nom')}
              >
                Nom {sortField === 'nom' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 border-b text-left">Prénom</th>
              <th className="px-6 py-3 border-b text-left">Email</th>
              <th className="px-6 py-3 border-b text-left">Rôle</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 border-b">{user.nom}</td>
                <td className="px-6 py-4 border-b">{user.prenom}</td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{user.role}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          &#9664;
        </button>
        <span className="text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          &#9654;
        </button>
      </div>
    </main>
  );
};

export default AdminDashboard;