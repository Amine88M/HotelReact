import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ReservationForm.css';

function ReservationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    DateCheckIn: '',
    DateCheckOut: '',
    NombreAdults: 1,
    NombreEnfants: 0,
    Id_Type_Chambre: 1,
    Telephone: '',
    PrixTotal: 0,
    Statut: 'reserved'  // Valeur par défaut comme dans le modèle C#
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Formatage des données pour correspondre exactement au modèle C#
    const dataToSend = {
      ...formData,
      DateCheckIn: `${formData.DateCheckIn}T00:00:00`,
      DateCheckOut: `${formData.DateCheckOut}T00:00:00`,
      NombreAdults: Number(formData.NombreAdults),
      NombreEnfants: Number(formData.NombreEnfants),
      Id_Type_Chambre: Number(formData.Id_Type_Chambre),
      PrixTotal: Number(formData.PrixTotal)
    };

    console.log('Données envoyées à l\'API:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetch('https://localhost:7141/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création de la réservation');
      }

      const result = await response.json();
      console.log('Réponse de l\'API:', result);

      Swal.fire({
        title: 'Succès!',
        text: 'La réservation a été créée avec succès',
        icon: 'success',
        confirmButtonColor: '#8CD4B9'
      }).then(() => {
        navigate('/Receptionist/reservations');
      });
    } catch (error) {
      console.error('Erreur complète:', error);

      // Afficher le message d'erreur spécifique
      Swal.fire({
        title: 'Erreur!',
        text: error.message || 'Impossible de créer la réservation. Veuillez vérifier les données saisies.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Créer une Réservation</h2>
      
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="row border p-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Type de Chambre</label>
              <select
                className="form-select"
                name="Id_Type_Chambre"
                value={formData.Id_Type_Chambre}
                onChange={handleChange}
                required
              >
                <option value="1">Chambre Simple</option>
                <option value="2">Chambre Double</option>
                <option value="3">Suite</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Date d'Arrivée (Check-In)</label>
              <input
                type="date"
                className="form-control"
                name="DateCheckIn"
                value={formData.DateCheckIn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date de Départ (Check-Out)</label>
              <input
                type="date"
                className="form-control"
                name="DateCheckOut"
                value={formData.DateCheckOut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Numéro de Téléphone</label>
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-phone"></i></span>
                <input
                  type="tel"
                  className="form-control"
                  name="Telephone"
                  value={formData.Telephone}
                  onChange={handleChange}
                  pattern="^\d{10}$"
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                name="Nom"
                value={formData.Nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                name="Prenom"
                value={formData.Prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre d'Adultes</label>
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
                <input
                  type="number"
                  className="form-control"
                  name="NombreAdults"
                  value={formData.NombreAdults}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre d'Enfants</label>
              <div className="input-group">
                <span className="input-group-text"><i className="fas fa-child"></i></span>
                <input
                  type="number"
                  className="form-control"
                  name="NombreEnfants"
                  value={formData.NombreEnfants}
                  onChange={handleChange}
                  min="0"
                  max="10"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Prix Total</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  name="PrixTotal"
                  value={formData.PrixTotal}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button 
            type="submit" 
            className="btn"
            style={{ backgroundColor: '#8CD4B9', color: 'white' }}
          >
            Créer Réservation
          </button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: '#F8B1A5', color: 'white' }}
            onClick={() => navigate('/Receptionist/reservations')}
          >
            Retour à la Liste
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;