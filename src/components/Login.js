import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://localhost:7141/api/roles');
        if (response.data) {
          setRoles(response.data);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la récupération des rôles';
        setApiResponse(errorMessage);
      }
    };
  
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email est requis';
    if (!formData.password) newErrors.password = 'Mot de passe est requis';
    if (!formData.role) newErrors.role = 'Rôle est requis';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('https://localhost:7141/api/login', formData);
        const message = response.data?.message || 'Connexion réussie';
        setApiResponse(message);

        if (response.data?.success) {
          const role = response.data?.role;
          const userId = response.data?.id;
         
          localStorage.setItem('userId', userId);
          console.log('userId:', userId);
          localStorage.setItem('role', role);
          console.log('role:', role);

          switch (role) {
            case 'Admin':
              navigate('/admin/dashboard');
              break;
            case 'Receptionist':
              navigate('/Receptionist/dashboard');
              break;
            case 'Personnel De Menage':
              navigate('/PersonnelDeMenage');
              break;
            default:
              setApiResponse('Rôle non reconnu');
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erreur de connexion au serveur';
        setApiResponse(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/images/image.png')"}}>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        {apiResponse && (
          <div className={`p-4 mb-4 rounded ${
            apiResponse.toLowerCase().includes('échec') || 
            apiResponse.toLowerCase().includes('erreur') || 
            apiResponse.toLowerCase().includes('vérifiez') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {apiResponse}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de Passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Sélectionnez un rôle</label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>Sélectionnez votre rôle</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <span className="text-sm text-red-600">{errors.role}</span>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            S'authentifier
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;