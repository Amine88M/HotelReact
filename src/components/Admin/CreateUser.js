import React, { useState } from 'react';

const CreateUser  = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    genre: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Le nom est obligatoire.";
    if (!formData.prenom) newErrors.prenom = "Le prénom est obligatoire.";
    if (!formData.email) newErrors.email = "L'adresse email est obligatoire.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Le numéro de téléphone est obligatoire.";
    if (!formData.password) newErrors.password = "Le mot de passe est obligatoire.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (!formData.role) newErrors.role = "Le rôle est obligatoire.";
    if (!formData.genre) newErrors.genre = "Le genre est obligatoire.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('https://localhost:7141/api/admin/usersPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nom: formData.nom,
          Prenom: formData.prenom,
          Email: formData.email,
          PhoneNumber: formData.phoneNumber,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
          Role: formData.role,
          Genre: formData.genre
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.Message || "Une erreur est survenue");
      }

      setSuccess("Utilisateur créé avec succès!");
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: '',
        genre: ''
      });
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Créer un Nouvel Utilisateur</h2>

      {apiError && <div className="bg-red-100 text-red-700 p-2 mb-4">{apiError}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nom</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="border p-2 w-full" />
          {errors.nom && <p className="text-red-500">{errors.nom}</p>}
        </div>
        <div>
          <label>Prénom</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="border p-2 w-full" />
          {errors.prenom && <p className="text-red-500">{errors.prenom}</p>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
          {errors.email && <p className="text-red-500">{errors.email }</p>}
        </div>
        <div>
          <label>Numéro de Téléphone</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="border p-2 w-full" />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
        </div>
        <div>
          <label>Mot de Passe</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="border p-2 w-full" />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div>
          <label>Confirmer le Mot de Passe</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="border p-2 w-full" />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
        </div>
        <div>
          <label>Rôle</label>
          <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full">
            <option value="">Sélectionnez un rôle</option>
            <option value="receptionist">Réceptionniste</option>
            <option value="admin">Admin</option>
            <option value="entretient de menage">Entretien de ménage</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>
        <div>
          <label>Genre</label>
          <select name="genre" value={formData.genre} onChange={handleChange} className="border p-2 w-full">
            <option value="">Sélectionnez un genre</option>
            <option value="masculin">Masculin</option>
            <option value="féminin">Féminin</option>
            <option value="autre">Autre</option>
          </select>
          {errors.genre && <p className="text-red-500">{errors.genre}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">Créer Utilisateur</button>
      </form>
    </div>
  );
};

export default CreateUser ;