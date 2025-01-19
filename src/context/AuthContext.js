import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifier l'authentification au chargement
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setUser(user);
            } catch (error) {
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('https://localhost:7141/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: 'receptionist'
                })
            });

            const data = await response.json();

            if (response.ok && data.Token) {
                localStorage.clear();
                localStorage.setItem('token', data.Token);
                localStorage.setItem('userId', data.Id);
                localStorage.setItem('role', data.Role);
                
                const userData = {
                    id: data.Id,
                    nom: data.Nom || 'Utilisateur',
                    role: data.Role,
                    email: email
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                setUser(userData);

                if (data.Role?.toLowerCase() === 'receptionist') {
                    navigate('/Receptionist/dashboard', { replace: true });
                    return { success: true };
                } else {
                    throw new Error('Accès non autorisé pour ce rôle');
                }
            } else {
                throw new Error(data.message || 'Identifiants invalides');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/', { replace: true });
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 