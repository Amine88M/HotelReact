import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/styles.css';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
//test push 
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate(); // Initialisation de useNavigate

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

          // Redirection en fonction du rôle
          if (response.data.role === 'Admin') {
            navigate('/admin'); // Redirige vers la page Admin
          } else if (response.data.role === 'Receptionist') {
            navigate('/reception'); // Redirige vers une autre page si nécessaire
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
              <option value="Receptionist">Receptionist</option>
              <option value="Admin">Admin</option>
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
