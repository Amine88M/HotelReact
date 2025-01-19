import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ReservationForm.css';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = "wAIqQoExHXPkW93qN";
const EMAILJS_SERVICE_ID = "service_b0qbdop";
const EMAILJS_TEMPLATE_ID = "template_bnzuc7h";

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
    ModePaiement: '',
    email: '',
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
  
    // Vérifier que le mode de paiement est sélectionné
    if (!formData.ModePaiement) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez sélectionner un mode de paiement.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }
  
    // Vérifier les limites d'adultes et d'enfants pour le type de chambre sélectionné
    const typeChambreSelectionne = typeChambres.find(tc => tc.id_Type_Chambre === parseInt(formData.id_Type_Chambre));
    
    if (typeChambreSelectionne) {
      // Vérification du nombre d'adultes
      if (parseInt(formData.NombreAdults) > typeChambreSelectionne.nbrAdulteMax) {
        Swal.fire({
          title: 'Erreur!',
          text: `Ce type de chambre ne peut accueillir que ${typeChambreSelectionne.nbrAdulteMax} adultes maximum.`,
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        return;
      }

      // Vérification du nombre d'enfants avec message personnalisé
      if (typeChambreSelectionne.nbrEnfantMax === 0 && parseInt(formData.NombreEnfants) > 0) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Ce type de chambre ne peut pas accueillir d\'enfants.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        return;
      } else if (parseInt(formData.NombreEnfants) > typeChambreSelectionne.nbrEnfantMax) {
        Swal.fire({
          title: 'Erreur!',
          text: `Ce type de chambre ne peut accueillir que ${typeChambreSelectionne.nbrEnfantMax} enfants maximum.`,
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        return;
      }
    }

    // Convertir les dates en objets Date pour une comparaison correcte
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
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
  
    try {
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

      // Log des données avant envoi
      console.log('Données à envoyer à l\'API de réservation:', dataToSend);

      // Première étape : créer la réservation
      const reservationResponse = await fetch('https://localhost:7141/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!reservationResponse.ok) {
        throw new Error('Erreur lors de la création de la réservation');
      }

      const result = await reservationResponse.json();
      console.log('Réponse complète:', result);

      // Extraire l'ID de la réservation de la réponse
      const reservationId = result.reservation.id;
      console.log('ID de la réservation:', reservationId);

      if (!reservationId) {
        throw new Error('ID de réservation non disponible dans la réponse');
      }

      // Créer le paiement avec l'ID récupéré
      const paiementData = {
        ReservationId: parseInt(reservationId),
        Montant: parseFloat(formData.PrixTotal),
        MethodPaiement: formData.ModePaiement === 'carte' ? 'Carte Bancaire' : 
                       formData.ModePaiement === 'especes' ? 'Espèces' :
                       formData.ModePaiement === 'cheque' ? 'Chèque' : 
                       'Lien de Paiement',
        DatePaiement: new Date().toISOString(),
        StatutPaiement: 0
      };

      console.log('Données paiement à envoyer:', paiementData);

      const paiementResponse = await fetch('https://localhost:7141/api/paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData)
      });

      if (!paiementResponse.ok) {
        const errorData = await paiementResponse.json();
        console.error('Erreur paiement détaillée:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement du paiement');
      }

      // Si tout s'est bien passé
      Swal.fire({
        title: 'Succès!',
        text: 'La réservation et le paiement ont été créés avec succès',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      }).then(() => {
        navigate('/Receptionist/reservations');
      });

    } catch (error) {
      console.error('Erreur complète:', error);
      
      Swal.fire({
        title: 'Erreur!',
        text: error.message || 'Une erreur est survenue lors de la création de la réservation.',
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
      
      // Vérification en temps réel pour le nombre de personnes
      if (['NombreAdults', 'NombreEnfants', 'id_Type_Chambre'].includes(name)) {
        const typeChambreSelectionne = typeChambres.find(tc => tc.id_Type_Chambre === parseInt(newData.id_Type_Chambre));
        
        if (typeChambreSelectionne) {
          // Vérification du nombre d'adultes
          if (parseInt(newData.NombreAdults) > typeChambreSelectionne.nbrAdulteMax) {
            Swal.fire({
              title: 'Attention!',
              text: `Ce type de chambre ne peut accueillir que ${typeChambreSelectionne.nbrAdulteMax} adultes maximum.`,
              icon: 'warning',
              confirmButtonColor: '#F8B1A5',
            });
          }
          
          // Vérification du nombre d'enfants avec message personnalisé
          if (typeChambreSelectionne.nbrEnfantMax === 0 && parseInt(newData.NombreEnfants) > 0) {
            Swal.fire({
              title: 'Attention!',
              text: 'Ce type de chambre ne peut pas accueillir d\'enfants.',
              icon: 'warning',
              confirmButtonColor: '#F8B1A5',
            });
          } else if (parseInt(newData.NombreEnfants) > typeChambreSelectionne.nbrEnfantMax) {
            Swal.fire({
              title: 'Attention!',
              text: `Ce type de chambre ne peut accueillir que ${typeChambreSelectionne.nbrEnfantMax} enfants maximum.`,
              icon: 'warning',
              confirmButtonColor: '#F8B1A5',
            });
          }
        }
      }
      
      // Recalculer le prix total si nécessaire
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

  const handlePrintFacture = () => {
    // Vérification des champs obligatoires
    if (!formData.Nom || !formData.Prenom || !formData.Telephone || 
        !formData.DateCheckIn || !formData.DateCheckOut || 
        !formData.id_Type_Chambre || !formData.NombreAdults || 
        !formData.ModePaiement) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez remplir tous les champs obligatoires et sélectionner un mode de paiement avant d\'imprimer la facture.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
      return;
    }

    // Si toutes les validations sont passées, on procède à l'impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture de Réservation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            .facture {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3498db;
            }
            .content {
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 20px;
            }
            .total {
              font-size: 1.2em;
              font-weight: bold;
              text-align: right;
              padding-top: 20px;
              border-top: 2px solid #3498db;
            }
          </style>
        </head>
        <body>
          <div class="facture">
            <div class="header">
              <h1>Facture de Réservation</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              <div class="section">
                <h3>Informations Client</h3>
                <p>Nom: ${formData.Nom}</p>
                <p>Prénom: ${formData.Prenom}</p>
                <p>Téléphone: ${formData.Telephone}</p>
              </div>
              <div class="section">
                <h3>Détails Réservation </h3>
                <p>Date d'arrivée: ${formData.DateCheckIn}</p>
                <p>Date de départ: ${formData.DateCheckOut}</p>
                <p>Nombre d'adultes: ${formData.NombreAdults}</p>
                <p>Nombre d'enfants: ${formData.NombreEnfants || 0}</p>
                <p>Type de chambre: ${typeChambres.find(tc => tc.id_Type_Chambre === parseInt(formData.id_Type_Chambre))?.nom_Type_Chambre || ''}</p>
              </div>
              <div class="section">
                <h3>Paiement</h3>
                <p>Mode de paiement: ${formData.ModePaiement}</p>
              </div>
            </div>
            <div class="total">
              Prix Total: ${formData.PrixTotal.toFixed(2)} €
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Initialiser EmailJS (à mettre dans useEffect)
  useEffect(() => {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }, []);

  // Modifier la fonction handleSendPaymentLink
  const handleSendPaymentLink = async () => {
    if (!formData.email) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez saisir une adresse email valide',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
      return;
    }

    try {
      await Swal.fire({
        title: 'Envoi en cours...',
        text: 'Envoi du lien de paiement',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false
      });

      const templateParams = {
        to_email: formData.email,
        to_name: `${formData.Prenom} ${formData.Nom}`,
        from_name: "Hôtel Réservation",
        subject: "Confirmation de réservation et lien de paiement - Hôtel",
        message: `
          Cher(e) ${formData.Prenom} ${formData.Nom},

          Nous vous remercions pour votre réservation à notre hôtel.

          Détails de votre réservation :
          --------------------------------
          - Date d'arrivée : ${formData.DateCheckIn}
          - Date de départ : ${formData.DateCheckOut}
          - Type de chambre : ${typeChambres.find(tc => tc.id_Type_Chambre === parseInt(formData.id_Type_Chambre))?.nom_Type_Chambre || ''}
          - Montant total : ${formData.PrixTotal.toFixed(2)} €

          Pour finaliser votre réservation, veuillez procéder au paiement en cliquant sur le lien ci-dessous :
          ${formData.payment_link}

          Si vous avez des questions, n'hésitez pas à nous contacter.

          Cordialement,
          L'équipe de l'Hôtel
        `,
        payment_link: "http:/khelesseni/paiement"
      };

      console.log('Email destiné à:', formData.email);
      console.log('Template utilisé:', EMAILJS_TEMPLATE_ID);
      console.log('Service utilisé:', EMAILJS_SERVICE_ID);

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('Email envoyé avec succès à:', formData.email);
      }

      Swal.fire({
        title: 'Succès!',
        text: `Le lien de paiement a été envoyé à ${formData.email}`,
        icon: 'success',
        confirmButtonColor: '#8CD4B9'
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de l\'envoi de l\'email. Veuillez vérifier la configuration.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-content">
        <div className="panel-header">
          <h2 className="panel-title">
            <i className="fas fa-calendar-check me-2"></i>
            Créer une Réservation
          </h2>
        </div>

        <div className="reservation-form-container">
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-grid">
              {/* Colonne gauche */}
              <div className="form-section">
                <div className="section-content">
                  <h4 className="section-title">
                    <i className="fas fa-bed me-2"></i>
                    Détails du Séjour
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Type de Chambre</label>
                    <select
                      className="form-select"
                      name="id_Type_Chambre"
                      value={formData.id_Type_Chambre}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un type de chambre</option>
                      {typeChambres.map(tc => (
                        <option key={tc.id_Type_Chambre} value={tc.id_Type_Chambre}>
                          {tc.nom_Type_Chambre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date d'Arrivée</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          name="DateCheckIn"
                          value={formData.DateCheckIn}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date de Départ</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          name="DateCheckOut"
                          value={formData.DateCheckOut}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="form-section">
                <div className="section-content">
                  <h4 className="section-title">
                    <i className="fas fa-user me-2"></i>
                    Informations Client
                  </h4>

                  <div className="form-row">
                    <div className="form-group">
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

                    <div className="form-group">
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
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

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Adultes</label>
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

                    <div className="form-group">
                      <label className="form-label">Enfants</label>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Nouvelle section Mode de Paiement */}
            <div className="payment-section">
              <div className="section-content">
                <h4 className="section-title">
                  <i className="fas fa-credit-card me-2"></i>
                  Mode de Paiement
                </h4>
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="carte"
                      name="ModePaiement"
                      value="carte"
                      checked={formData.ModePaiement === 'carte'}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="carte">
                      <i className="far fa-credit-card"></i>
                      Carte Bancaire
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="especes"
                      name="ModePaiement"
                      value="especes"
                      checked={formData.ModePaiement === 'especes'}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="especes">
                      <i className="fas fa-money-bill-wave"></i>
                      Espèces
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cheque"
                      name="ModePaiement"
                      value="cheque"
                      checked={formData.ModePaiement === 'cheque'}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="cheque">
                      <i className="fas fa-money-check"></i>
                      Chèque
                    </label>
                  </div>

                  <div className="payment-option payment-option-link">
                    <input
                      type="radio"
                      id="lien_paiement"
                      name="ModePaiement"
                      value="lien_paiement"
                      checked={formData.ModePaiement === 'lien_paiement'}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="lien_paiement">
                      <i className="fas fa-link"></i>
                      Lien de Paiement
                    </label>
                  </div>
                </div>

                {/* Champ email conditionnel */}
                {formData.ModePaiement === 'lien_paiement' && (
                  <div className="payment-link-section">
                    <div className="email-input-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email du client"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSendPaymentLink}
                      >
                        <i className="fas fa-paper-plane me-2"></i>
                        Envoyer le lien
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prix Total */}
            <div className="total-price-section">
              <div className="price-container">
                <h4 className="price-label">Prix Total</h4>
                <div className="price-value">
                  <span className="currency">$</span>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.PrixTotal.toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
              >
                <i className="fas fa-check me-2"></i>
                Créer Réservation
              </button>
              <button
                type="button"
                className="btn btn-info"
                onClick={handlePrintFacture}
                style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
              >
                <i className="fas fa-print me-2"></i>
                Imprimer Facture
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => navigate('/Receptionist/reservations')}
              >
                <i className="fas fa-times me-2"></i>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;