import React, { useState, useEffect } from 'react';
import { UserCircle, Camera, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile({ isOpen, onClose }) {
    const [userData, setUserData] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Charger les données utilisateur depuis le localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }

        // Récupérer l'ID utilisateur
        const userId = localStorage.getItem('userId');
        console.log('ID utilisateur récupéré:', userId); // Log pour vérifier l'ID

        // Charger la photo de profil
        if (userId) {
            const token = localStorage.getItem('token');
            console.log('Token récupéré:', token); // Log pour vérifier le token

            fetch(`https://localhost:7141/api/user/${userId}/photo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                console.log('Statut de la réponse:', response.status); // Log pour vérifier le statut
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                console.log('Photo récupérée avec succès'); // Log pour confirmer la réception
                setProfilePhoto(URL.createObjectURL(blob));
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la photo:', error);
            });
        }
    }, []);

    const handlePhotoChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            
            const response = await fetch(`https://localhost:7141/api/user/${userId}/photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setProfilePhoto(URL.createObjectURL(file));
            }
        } catch (error) {
            console.error('Erreur lors du changement de photo:', error);
        }
    };

    const handlePasswordChange = () => {
        // Implémenter le changement de mot de passe
        console.log('Changement de mot de passe');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* En-tête du modal */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Paramètres du profil</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                
                {/* Contenu du modal */}
                <div className="p-4 space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Photo de profil */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <UserCircle size={64} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                                <Camera size={16} className="text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>

                        {/* Informations utilisateur */}
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                {userData?.nom || 'Utilisateur'}
                            </h3>
                            <p className="text-sm text-gray-500">{userData?.email}</p>
                            <p className="text-xs text-gray-400">{userData?.role}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePasswordChange}
                            className="w-full flex items-center p-3 text-left text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            <Key size={20} className="mr-3" />
                            <span>Changer le mot de passe</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center p-3 text-left text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile; 