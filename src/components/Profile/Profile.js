import React, { useState, useEffect } from 'react';
import { UserCircle, Camera, Key, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile({ isOpen, onClose }) {
    const [userData, setUserData] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                console.log('Fetching user data for ID:', userId); // Log pour debug

                const response = await fetch(`https://localhost:7141/api/admin/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }

                const data = await response.json();
                console.log('User data received:', data); // Log pour debug
                setUserData(data);

                // Charger la photo de profil
                if (userId) {
                    const photoResponse = await fetch(`https://localhost:7141/api/user/${userId}/photo`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (photoResponse.ok) {
                        const blob = await photoResponse.blob();
                        setProfilePhoto(URL.createObjectURL(blob));
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchUserData();
    }, []);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            console.log('Changing photo for user:', userId); 
            console.log('File being uploaded:', file); // Log pour vérifier le fichier

            const formData = new FormData();
            formData.append('file', file); // Changé 'photo' en 'file' pour correspondre à l'API
            
            // Log pour vérifier le contenu du FormData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            const response = await fetch(`https://localhost:7141/api/user/${userId}/change-photo`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Retiré Content-Type pour laisser le navigateur le définir automatiquement avec le boundary
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData); // Log la réponse d'erreur du serveur
                throw new Error(`Erreur lors du changement de la photo: ${errorData}`);
            }

            console.log('Photo changed successfully');

            // Recharger la photo immédiatement après le changement
            const photoResponse = await fetch(`https://localhost:7141/api/user/${userId}/photo`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (photoResponse.ok) {
                const blob = await photoResponse.blob();
                setProfilePhoto(URL.createObjectURL(blob));
                console.log('Photo updated in UI');
            }
        } catch (error) {
            console.error('Erreur lors du changement de photo:', error);
            alert(`Erreur lors du changement de la photo: ${error.message}`);
        }
    };

    const changePassword = async (userId, currentPassword, newPassword, confirmNewPassword) => {
        try {
            // Validation côté client
            if (newPassword !== confirmNewPassword) {
                throw new Error("Les nouveaux mots de passe ne correspondent pas");
            }

            if (newPassword.length < 6) {
                throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }

            const token = localStorage.getItem('token');
            console.log('Envoi de la requête avec les données:', {
                userId,
                hasCurrentPassword: !!currentPassword,
                hasNewPassword: !!newPassword,
                hasConfirmPassword: !!confirmNewPassword
            });

            const response = await fetch(`https://localhost:7141/api/user/${userId}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword
                }),
            });

            console.log('Statut de la réponse:', response.status);
            const text = await response.text();
            console.log('Réponse brute:', text);

            let result;
            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.log('Réponse non-JSON:', text);
                result = { message: text };
            }

            if (!response.ok) {
                throw new Error(
                    result.message || 
                    result.errors?.join(", ") || 
                    "Erreur lors du changement de mot de passe"
                );
            }

            console.log("Mot de passe changé avec succès");
            return result;
        } catch (error) {
            console.error("Erreur détaillée:", error);
            throw error;
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPasswordError("Les mots de passe ne correspondent pas");
                return;
            }

            const userId = localStorage.getItem('userId');
            console.log('Tentative de changement de mot de passe pour userId:', userId);

            await changePassword(
                userId,
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );

            // Réinitialiser le formulaire et fermer le modal
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordModal(false);
            alert('Mot de passe modifié avec succès');

        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            setPasswordError(error.message || "Une erreur est survenue lors du changement de mot de passe");
        }
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
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-semibold">{userData?.nom || 'Utilisateur'}</span>
                                <span className="text-sm text-gray-600">{userData?.role || 'Rôle non défini'}</span>
                               
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center text-gray-700 hover:bg-gray-100 px-4 py-2 w-full"
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

            {/* Modal de changement de mot de passe */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe actuel
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        currentPassword: e.target.value
                                    })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile; 