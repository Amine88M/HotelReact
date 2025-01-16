import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`https://localhost:7141/api/admin/users?page=${currentPage}`)
      .then((response) => {
        console.log('Réponse de l\'API:', response.data);
  
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setTotalPages(1);
        } else if (response.data.users) {
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.error('La réponse de l\'API ne contient pas d\'utilisateurs.');
        }
        setError('');
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setError('Erreur lors du chargement des utilisateurs.');
      });
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete('https://localhost:7141/api/admin/users', {
        data: { ids: selectedUsers },
      });
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      setError(
        error.response?.data?.message || 'Erreur lors de la suppression des utilisateurs.'
      );
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="px-4 py-2 border rounded-lg flex-1"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors
              ${selectedUsers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
          >
            Supprimer la sélection
          </button>
        </div>
      </header>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b">
                <input type="checkbox" onChange={handleSelectAll} className="rounded" />
              </th>
              <th className="px-6 py-3 border-b text-left">Nom</th>
              <th className="px-6 py-3 border-b text-left">Email</th>
              <th className="px-6 py-3 border-b text-left">Rôle</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((user) =>
                  user.nom?.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id)
                            );
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">{user.nom}</td>
                    <td className="px-6 py-4 border-b">{user.email}</td>
                    <td className="px-6 py-4 border-b">{user.role}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => console.log(`Modifier utilisateur ${user.id}`)}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center border-b">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 transition-colors'
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          &#9664;
        </button>
        <span className="text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 transition-colors'
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          &#9654;
        </button>
      </div>
    </main>
  );
};

export default AdminDashboard;
