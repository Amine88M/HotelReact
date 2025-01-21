import React, { createContext, useState } from 'react';

// Créez un contexte pour l'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Fonction pour connecter l'utilisateur
  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};