import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
// Assurez-vous que le fichier CSS existe et contient les styles nécessaires
// import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // Initialise avec un tableau vide
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Charger la liste des utilisateurs depuis l'API
  useEffect(() => {
    axios
      .get(`https://localhost:7141/api/admin/users?page=${currentPage}`)
      .then((response) => {
        console.log('Réponse de l\'API:', response.data);
  
        // Ajustez selon la structure réelle de la réponse
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setTotalPages(1); // Si l'API ne fournit pas de pagination, définissez une seule page
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
  

  // Gérer la recherche
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Gérer la sélection en masse
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Gérer la suppression des utilisateurs sélectionnés
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
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Liste des Utilisateurs</h1>
          <div className="actions">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="search-bar"
              value={search}
              onChange={handleSearchChange}
            />
            <button
              className="delete-btn"
              onClick={handleDeleteSelected}
              disabled={selectedUsers.length === 0}
            >
              Supprimer la sélection
            </button>
          </div>
        </header>

        {/* Messages d'erreur */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Table des utilisateurs */}
        <table className="user-table table table-bordered">
          <thead>
            <tr>
              <th>
                <input type="checkbox" onChange={handleSelectAll} />
              </th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users
                .filter((user) =>
                  user.nom?.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>
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
                      />
                    </td>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`status ${
                          user.status === 'active' ? 'active' : 'inactive'
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => console.log(`Modifier utilisateur ${user.id}`)}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            id="prev-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            &#9664;
          </button>
          <span id="page-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            id="next-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            &#9654;
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
