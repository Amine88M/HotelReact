import React from 'react';

const Sidebar = () => {
  const handleLogout = () => {
    // Effectuer des actions nécessaires avant la déconnexion, si nécessaire
    window.location.href = '/'; // Redirige vers la route de déconnexion
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Gestion des Comptes</h2>
      <nav className="space-y-2">
        <a
          href="/admin/create-user"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          <span>➕</span> Créer un Compte
        </a>
        <a
          href="/admin/user-list"
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-700"
        >
          <span>🏠</span> Liste des Utilisateurs
        </a>
        <a
          href="/admin/assign-roles"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          <span>⚙️</span> Attribuer Rôles
        </a>
        <a
          href="/admin/reset-password"
          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          <span>🔒</span> Réinitialiser Mot de Passe
        </a>
      </nav>
      
      <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-3 text-gray-300">
          <span>👤</span> <span>Utilisateur</span>
        </div>
        <button
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
