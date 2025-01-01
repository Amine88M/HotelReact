import React from 'react';
// import '../styles/styles.css';

const Sidebar = () => {
  const handleLogout = () => {
    // Effectuer des actions nécessaires avant la déconnexion, si nécessaire
    window.location.href = '/logout'; // Redirige vers la route de déconnexion
  };

  return (
    <aside className="sidebar d-flex flex-column">
      <h2>Gestion des Comptes</h2>
      <nav className="nav flex-column">
        <a href="/admin/create-user" className="nav-link">
          <span className="icon">➕</span> Créer un Compte
        </a>
        <a href="/admin/user-list" className="nav-link active">
          <span className="icon">🏠</span> Liste des Utilisateurs
        </a>
        <a href="/admin/assign-roles" className="nav-link">
          <span className="icon">⚙️</span> Attribuer Rôles
        </a>
        <a href="/admin/reset-password" className="nav-link">
          <span className="icon">🔒</span> Réinitialiser Mot de Passe
        </a>
      </nav>
      <div className="mt-auto p-3">
        <div className="d-flex align-items-center mb-3">
          <span className="me-2">👤</span> <span>Utilisateur</span>
        </div>
        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          <span className="me-2">🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
