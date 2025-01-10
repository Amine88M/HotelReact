import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [roles, setRoles] = useState([]); // **NOUVEL AJOUT : Liste des rôles dynamiques**
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate(); // Initialisation de useNavigate

  // **NOUVEL AJOUT : Récupération des rôles depuis le backend**
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://localhost:7141/api/roles');
        setRoles(response.data); // Mettre à jour la liste des rôles
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles :', error);
      }
    };
  
    fetchRoles();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
        // Envoi des données au backend
        const response = await axios.post('https://localhost:7141/api/login', formData);
        setApiResponse(response.data.message);

        if (response.data.success) {
          console.log('Connexion réussie :', response.data);

          // **NOUVEL AJOUT : Redirection en fonction du rôle**
          if (response.data.role === 'Admin') {
            navigate('/admin'); // Redirige vers la page Admin
          } else if (response.data.role === 'Receptionist') {
            navigate('/Receptionist'); // Redirige vers la page Réception
          } else if (response.data.role === 'Personnel De Menage') {
            navigate('/PersonnelDeMenage'); // Redirige vers une page Manager
          }
        }
      } catch (error) {
        if (error.response) {
          setApiResponse(error.response.data.message || 'Erreur de connexion.');
          console.error('Erreur API :', error.response.data);
        } else {
          setApiResponse('Erreur de connexion au serveur.');
          console.error('Erreur réseau :', error.message);
        }
      }
    }
  };

  const backgroundStyle = {
    backgroundImage: "url('/images/image.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-container">
        <h2 className="text-center">Connexion</h2>

        {apiResponse && (
          <div className={`alert ${errors.email || errors.password || errors.role ? 'alert-danger' : 'alert-success'}`}>
            {apiResponse}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de Passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Sélectionnez un rôle</label>
            <select
  id="role"
  name="role"
  className="form-control"
  value={formData.role}
  onChange={handleChange}
>
  <option value="" disabled>Sélectionnez votre rôle</option>
  {roles.map((role, index) => (
    <option key={index} value={role}>{role}</option>
  ))}
</select>
            {errors.role && <span className="text-danger">{errors.role}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-100">S'authentifier</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
