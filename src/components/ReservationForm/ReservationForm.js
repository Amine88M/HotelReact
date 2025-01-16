import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ReservationForm.css';

function ReservationForm() {
  const navigate = useNavigate();
  const [typeChambres, setTypeChambres] = useState([]);
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    DateCheckIn: '',
    DateCheckOut: '',
    NombreAdults: 1,
    NombreEnfants: 0,
    id_Type_Chambre: 0,
    Telephone: '',
    PrixTotal: 0,
    Statut: 'reserved',
  });

  // Récupérer les types de chambre depuis l'API
  useEffect(() => {
    const fetchTypeChambres = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/typechambres');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des types de chambre');
        }
        const data = await response.json();
        setTypeChambres(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchTypeChambres();
  }, []);

  // Calculer la durée du séjour en jours
  const calculerDuree = (dateCheckIn, dateCheckOut) => {
    const date1 = new Date(dateCheckIn);
    const date2 = new Date(dateCheckOut);
    const difference = date2.getTime() - date1.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24)); // Convertir en jours
  };

  // Calculer le prix total en fonction du type de chambre et de la durée
  const calculerPrixTotal = () => {
    if (!formData.id_Type_Chambre || !formData.DateCheckIn || !formData.DateCheckOut) {
      return 0;
    }

    const typeChambre = typeChambres.find(tc => tc.id_Type_Chambre === parseInt(formData.id_Type_Chambre));
    if (!typeChambre) return 0;

    const duree = calculerDuree(formData.DateCheckIn, formData.DateCheckOut);
    if (duree <= 0) return 0;

    return typeChambre.prixParNuit * duree;
  };

  // Mettre à jour le prix total chaque fois que les données du formulaire changent
  useEffect(() => {
    const prixTotal = calculerPrixTotal();
    setFormData((prev) => ({ ...prev, PrixTotal: prixTotal }));
  }, [formData.id_Type_Chambre, formData.DateCheckIn, formData.DateCheckOut, typeChambres]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convertir les dates en objets Date pour une comparaison correcte
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorer l'heure
  
    const dateCheckIn = new Date(formData.DateCheckIn);
    dateCheckIn.setHours(0, 0, 0, 0); // Ignorer l'heure
  
    // Vérifier que la date de check-in n'est pas dans le passé
    if (dateCheckIn < today) {
      Swal.fire({
        title: 'Erreur!',
        text: 'La date de réservation ne peut pas être dans le passé.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }
  
    // Vérifier que la date de check-out est après la date de check-in
    const dateCheckOut = new Date(formData.DateCheckOut);
    if (dateCheckOut <= dateCheckIn) {
      Swal.fire({
        title: 'Erreur!',
        text: 'La date de check-out doit être postérieure à la date de check-in.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }
  
    // Préparer les données à envoyer à l'API
    const dataToSend = {
      ...formData,
      Nom: formData.Nom,
      DateCheckIn: `${formData.DateCheckIn}T00:00:00`,
      DateCheckOut: `${formData.DateCheckOut}T00:00:00`,
      NombreAdults: Number(formData.NombreAdults),
      NombreEnfants: Number(formData.NombreEnfants),
      id_Type_Chambre: Number(formData.id_Type_Chambre),
      PrixTotal: calculerPrixTotal(),
    };
  
    try {
      const response = await fetch('https://localhost:7141/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création de la réservation');
      }
  
      const result = await response.json();
      console.log('Réponse de l\'API:', result);
  
      // Afficher un message de succès
      Swal.fire({
        title: 'Succès!',
        text: 'La réservation a été créée avec succès',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      }).then(() => {
        navigate('/Receptionist/reservations');
      });
    } catch (error) {
      console.error('Erreur complète:', error);
  
      // Afficher un message d'erreur
      Swal.fire({
        title: 'Erreur!',
        text: error.message || 'Impossible de créer la réservation. Veuillez vérifier les données saisies.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Recalculer le prix total si les champs pertinents changent
      if (['id_Type_Chambre', 'DateCheckIn', 'DateCheckOut'].includes(name)) {
        const prixTotal = calculerPrixTotal();
        return {
          ...newData,
          PrixTotal: prixTotal
        };
      }
      
      return newData;
    });
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
                name="id_Type_Chambre"
                value={formData.id_Type_Chambre}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un type de chambre</option>
                {typeChambres.map((tc) => (
                  <option key={tc.id_Type_Chambre} value={tc.id_Type_Chambre}>
                    {tc.nom_Type_Chambre}
                  </option>
                ))}
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
                <span className="input-group-text">
                  <i className="fas fa-phone"></i>
                </span>
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
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
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
                <span className="input-group-text">
                  <i className="fas fa-child"></i>
                </span>
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
                  type="text"
                  className="form-control"
                  value={formData.PrixTotal.toFixed(2)}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
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