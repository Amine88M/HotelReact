import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ChangePassword = ({ userId, userName, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false
  });

  const validatePassword = (password) => {
    setPasswordChecks({
      length: password.length >= 6,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        title: "Erreur",
        text: "Les nouveaux mots de passe ne correspondent pas",
        icon: "error"
      });
      return;
    }

    // Vérification des critères de complexité
    if (!Object.values(passwordChecks).every(check => check)) {
      Swal.fire({
        title: "Erreur",
        text: "Le nouveau mot de passe ne respecte pas tous les critères de sécurité",
        icon: "error"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`https://localhost:7141/api/admin/change-password/${userId}`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      Swal.fire({
        title: "Succès",
        text: response.data.message || "Le mot de passe a été modifié avec succès",
        icon: "success"
      }).then(() => {
        onClose();
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         "Une erreur est survenue lors du changement de mot de passe";
      
      Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error"
      });
      
      console.error('Erreur détaillée:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Changer le mot de passe pour {userName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ancien mot de passe
          </label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <div className="mt-2 text-sm space-y-1">
            <p className={`${passwordChecks.length ? 'text-green-600' : 'text-red-600'}`}>
              ✓ Au moins 6 caractères
            </p>
            <p className={`${passwordChecks.number ? 'text-green-600' : 'text-red-600'}`}>
              ✓ Au moins un chiffre
            </p>
            <p className={`${
              passwordChecks.uppercase && passwordChecks.lowercase ? 'text-green-600' : 'text-red-600'
            }`}>
              ✓ Au moins une lettre majuscule et minuscule
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Chargement...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;