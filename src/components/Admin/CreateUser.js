import React, { useState } from 'react';
import { MdPersonAdd, MdEmail, MdLock, MdWork } from 'react-icons/md';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    role: 'receptionist',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://localhost:7141/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            setError(data.message || "Données invalides");
            break;
          case 401:
            setError("Non autorisé - Veuillez vous reconnecter");
            break;
          case 403:
            setError("Vous n'avez pas les droits nécessaires");
            break;
          case 409:
            setError("Cet utilisateur existe déjà");
            break;
          case 500:
            setError("Erreur serveur - Veuillez réessayer plus tard");
            break;
          default:
            setError("Une erreur est survenue");
        }
        return;
      }

      alert('Utilisateur créé avec succès');
      setFormData({ nom: '', email: '', role: 'receptionist', password: '' });

    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex flex-shrink-0 justify-center items-center text-blue-500">
                <MdPersonAdd size={24} />
              </div>
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Créer un Nouvel Utilisateur</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Remplissez le formulaire pour créer un nouveau compte utilisateur
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <div className="flex items-center">
                    <MdPersonAdd className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Nom complet"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center">
                    <MdEmail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Adresse email"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center">
                    <MdWork className="absolute left-3 top-3 text-gray-400" size={20} />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                      required
                    >
                      <option value="receptionist">Réceptionniste</option>
                      <option value="personnel_menage">Personnel de Ménage</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center">
                    <MdLock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Cacher" : "Voir"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </span>
                  ) : (
                    'Créer l\'utilisateur'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;