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
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    letter: false,
    uppercase: false,
    lowercase: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const checkPassword = (password) => {
    setPasswordChecks({
      length: password.length >= 6,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      checkPassword(value);
    }
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      // Première requête pour créer l'utilisateur
      const userResponse = await fetch('https://localhost:7141/api/admin/usersPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
        })
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(errorText || "Une erreur est survenue");
      }

      const createdUser = await userResponse.json();
      console.log('Utilisateur créé:', createdUser);

      // Vérifier si nous avons un UserId dans la réponse
      if (selectedFile && createdUser.userId) { // Changé de id à userId
        console.log('ID utilisateur reçu:', createdUser.userId);
        
        const photoFormData = new FormData();
        photoFormData.append('file', selectedFile);

        const photoResponse = await fetch(`https://localhost:7141/api/user/${createdUser.userId}/upload-photo`, {
          method: 'POST',
          body: photoFormData
        });

        if (!photoResponse.ok) {
          console.error('Erreur upload photo:', await photoResponse.text());
          throw new Error('Erreur lors de l\'upload de la photo');
        }

        const photoResult = await photoResponse.json();
        console.log('Photo uploadée avec succès:', photoResult);
      } else {
        console.log('Données manquantes pour l\'upload:', {
          hasFile: !!selectedFile,
          userId: createdUser.userId
        });
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
      setSelectedFile(null);
      setPreviewUrl(null);

      // Faire disparaître le message après 5 secondes
      setTimeout(() => {
        setSuccess('');
      }, 5000);

    } catch (err) {
      console.error('Erreur complète:', err);
      setApiError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Créer un Nouvel Utilisateur</h2>

      {apiError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{apiError}</div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nom</label>
            <input 
              type="text" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Entrez le nom" 
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Prénom</label>
            <input 
              type="text" 
              name="prenom" 
              value={formData.prenom} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Entrez le prénom" 
            />
            {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="exemple@email.com" 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Numéro de Téléphone</label>
            <input 
              type="tel" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="+212 X XX XX XX XX" 
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mot de Passe</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="••••••••" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            
            {isPasswordFocused && (
              <div className="mt-2 text-sm space-y-1">
                <p className={`${passwordChecks.length ? 'text-green-500' : 'text-red-500'}`}>
                  ✓ Au moins 6 caractères
                </p>
                <p className={`${passwordChecks.number ? 'text-green-500' : 'text-red-500'}`}>
                  ✓ Au moins un chiffre
                </p>
                <p className={`${passwordChecks.uppercase && passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  ✓ Au moins une lettre majuscule et minuscule
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirmer le Mot de Passe</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="••••••••" 
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rôle</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
            >
              <option value="">Sélectionnez un rôle</option>
              <option value="receptionist">Réceptionniste</option>
              <option value="admin">Admin</option>
              <option value="personnel de menage">Personnel De Menage</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Genre</label>
            <select 
              name="genre" 
              value={formData.genre} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
            >
              <option value="">Sélectionnez un genre</option>
              <option value="masculin">Masculin</option>
              <option value="féminin">Féminin</option>
            </select>
            {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Photo de profil</label>
          <div className="flex items-center space-x-4">
            {previewUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Prévisualisation" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center"
          >
            <span>Créer Utilisateur</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser ;