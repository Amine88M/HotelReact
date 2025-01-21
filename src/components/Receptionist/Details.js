import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pour récupérer l'ID de l'URL
import {
  User,
  Calendar,
  Clock,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  BedDouble,
  Users,
  Utensils,
  Receipt,
  MessageSquare,
  AlertCircle,
  Coffee,
} from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';


// Remplacer les constantes AWS par EmailJS
const EMAILJS_SERVICE_ID = 'service_6p4yzr8';
const EMAILJS_TEMPLATE_ID = 'template_wpc01rg';
const EMAILJS_PUBLIC_KEY = 'RzyLN2Dx4ZY532q7c';

const ReservationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de l'URL
  const [reservation, setReservation] = useState(null);
  const [paiement, setPaiement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les détails de la réservation
        const resResponse = await fetch(`https://localhost:7141/api/reservations/${id}`);
        if (!resResponse.ok) throw new Error('Erreur lors de la récupération de la réservation');
        const resData = await resResponse.json();
        console.log('Données réservation:', resData);
        setReservation(resData);

        // Récupérer le paiement associé à la réservation
        const paiementResponse = await fetch(`https://localhost:7141/api/paiements/reservation/${id}`);
        if (paiementResponse.ok) {
          const paiementData = await paiementResponse.json();
          console.log('Données paiement:', paiementData);
          setPaiement(paiementData);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCancelReservation = async (reservationId) => {
    try {
      // Première confirmation avec mot de passe
      const passwordResult = await Swal.fire({
        title: 'Authentification requise',
        text: 'Veuillez entrer votre mot de passe pour confirmer l\'annulation',
        input: 'password',
        inputPlaceholder: 'Entrez votre mot de passe',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Retour',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
          if (!password) {
            Swal.showValidationMessage('Le mot de passe est requis');
            return false;
          }
          
          try {
            const response = await fetch('https://localhost:7141/api/auth/verify-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: "@receptionist.com",
                password: password
              })
            });

            const data = await response.json();
            if (data && data.success) {
              return true;
            }
            
            throw new Error(data.message || 'Mot de passe incorrect');
          } catch (error) {
            console.error('Erreur de vérification:', error);
            Swal.showValidationMessage('Mot de passe incorrect');
            return false;
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (!passwordResult.isConfirmed) {
        return;
      }

      // Deuxième confirmation avec texte à saisir
      const confirmResult = await Swal.fire({
        title: 'Confirmation supplémentaire',
        text: 'Écrivez "ANNULER" en majuscules pour confirmer l\'annulation',
        input: 'text',
        inputPlaceholder: 'ANNULER',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Retour',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        inputValidator: (value) => {
          if (value !== 'ANNULER') {
            return 'Veuillez écrire exactement "ANNULER"';
          }
        }
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      // Dernière confirmation
      const finalConfirm = await Swal.fire({
        title: 'Dernière vérification',
        text: "Cette action est irréversible. Êtes-vous absolument sûr de vouloir annuler cette réservation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, annuler définitivement',
        cancelButtonText: 'Non, retour'
      });

      if (!finalConfirm.isConfirmed) {
        return;
      }

      // Procéder à l'annulation
      const response = await fetch(`https://localhost:7141/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reservationId,
          statut: 'Annulé'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      Swal.fire({
        title: 'Annulée!',
        text: 'La réservation a été annulée avec succès.',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de l\'annulation.',
        'error'
      );
    }
  };

  // Ajoutez cette fonction de formatage
  const formatPhoneNumberToInternational = (phoneNumber) => {
    // Enlever les espaces ou autres caractères
    let cleaned = phoneNumber.replace(/\s+/g, '');
    
    // Si le numéro commence par 0
    if (cleaned.startsWith('0')) {
      // Remplacer le 0 par +212 (pour le Maroc)
      cleaned = '+212' + cleaned.substring(1);
    }
    
    return cleaned;
  };

  const handleSendReminder = async () => {
    try {
      const { value: emailToUse, isConfirmed: isEmailConfirmed } = await Swal.fire({
        title: 'Email du client',
        html: `
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700">
              Veuillez saisir l'email du client
            </label>
            <input 
              type="email" 
              id="swal-input-email" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="exemple@email.com"
              value="${reservation.email || ''}"
            >
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Envoyer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3085d6',
        preConfirm: () => {
          const email = document.getElementById('swal-input-email').value;
          if (!email) {
            Swal.showValidationMessage('L\'email est requis');
            return false;
          }
          return email;
        }
      });

      if (!isEmailConfirmed) return;

      setIsSending(true);

      // Paramètres correspondant exactement au template
      const templateParams = {
        to_email: emailToUse,
        to_name: `${reservation.prenom} ${reservation.nom}`,
        hotel_name: "Khelesseni",
        check_in_date: new Date(reservation.dateCheckIn).toLocaleDateString('fr-FR'),
        check_out_date: new Date(reservation.dateCheckOut).toLocaleDateString('fr-FR')
      };

      console.log('Paramètres envoyés:', templateParams);

      const response = await emailjs.send(
        'service_j33v4na',
        'template_1jbwiuq',
        templateParams,
        'RzyLN2Dx4ZY532q7c'
      );

      console.log('Réponse du serveur:', response);

      if (response.status === 200) {
        Swal.fire({
          title: 'Succès!',
          text: `L'email a été envoyé à ${emailToUse}`,
          icon: 'success',
          confirmButtonColor: '#3085d6'
        });
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de l\'envoi de l\'email. Vérifiez la console pour plus de détails.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Détails de la Réservation - ${reservation.id}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3498db;
            }
            .logo {
              font-size: 24px;
              color: #3498db;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .section-title {
              font-size: 18px;
              color: #2c3e50;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }
            .payment-status {
              font-weight: bold;
              padding: 4px 8px;
              border-radius: 4px;
            }
            .status-paid {
              color: #27ae60;
            }
            .status-pending {
              color: #f39c12;
            }
            .status-cancelled {
              color: #e74c3c;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏨 RoyalStay</div>
            <h1>Détails de la Réservation #${reservation.id}</h1>
          </div>

          <div class="section">
            <h2 class="section-title">Informations Client</h2>
            <div class="detail-row">
              <span>Nom complet:</span>
              <span>${reservation.nom} ${reservation.prenom}</span>
            </div>
            <div class="detail-row">
              <span>Téléphone:</span>
              <span>${reservation.telephone}</span>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Détails du Séjour</h2>
            <div class="detail-row">
              <span>Check-in:</span>
              <span>${new Date(reservation.dateCheckIn).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="detail-row">
              <span>Check-out:</span>
              <span>${new Date(reservation.dateCheckOut).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="detail-row">
              <span>Occupants:</span>
              <span>${reservation.nombreAdults} adultes, ${reservation.nombreEnfants} enfants</span>
            </div>
            <div class="detail-row">
              <span>Statut:</span>
              <span>${reservation.statut}</span>
            </div>
          </div>

          ${paiement ? `
            <div class="section">
              <h2 class="section-title">Détails du Paiement</h2>
              <div class="detail-row">
                <span>Montant total:</span>
                <span>${paiement[0].montant} €</span>
              </div>
              <div class="detail-row">
                <span>Méthode de paiement:</span>
                <span>${paiement[0].methodPaiement}</span>
              </div>
              <div class="detail-row">
                <span>Date de paiement:</span>
                <span>${new Date(paiement[0].datePaiement).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div class="detail-row">
                <span>Statut du paiement:</span>
                <span class="payment-status status-paid">Payé</span>
              </div>
              <div class="detail-row">
                <span>Référence paiement:</span>
                <span>#${paiement[0].idPaiement}</span>
              </div>
            </div>
          ` : `
            <div class="section">
              <h2 class="section-title">Détails du Paiement</h2>
              <div class="detail-row">
                <span>Aucun paiement enregistré pour cette réservation</span>
              </div>
            </div>
          `}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!reservation) return <div>Aucune réservation trouvée</div>;

  console.log('État paiement:', paiement); // Pour vérifier l'état

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête de réservation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Réservation #{reservation.id}</h1>
              <div className="mt-1 flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    reservation.statut === 'Confirmée'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {reservation.statut}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="fas fa-print"></i>
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="mr-2" size={20} />
            Informations Client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <User className="mr-2" size={16} />
                  <span className="font-medium">
                    {reservation.nom} {reservation.prenom}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="mr-2" size={16} />
                  <span>{reservation.telephone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Détails du séjour */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BedDouble className="mr-2" size={20} />
              Détails Réservation
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>Date de réservation</span>
                </div>
                <span className="font-medium">
                  {new Date(reservation.dateReservation).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>Check-in</span>
                </div>
                <span className="font-medium">
                  {new Date(reservation.dateCheckIn).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>Check-out</span>
                </div>
                <span className="font-medium">
                  {new Date(reservation.dateCheckOut).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Users className="mr-2" size={16} />
                  <span>Occupants</span>
                </div>
                <span className="font-medium">
                  {reservation.nombreAdults} adultes, {reservation.nombreEnfants} enfant
                </span>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="mr-2" size={20} />
              Détails du Paiement
            </h2>
            <div className="space-y-4">
              {paiement ? (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Montant total</span>
                    <span className="font-medium">{paiement[0].montant} €</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Méthode de paiement</span>
                    <span className="font-medium">{paiement[0].methodPaiement}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Date de paiement</span>
                    <span className="font-medium">
                      {new Date(paiement[0].datePaiement).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Statut du paiement</span>
                    <span className="font-medium text-green-600">Payé</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Référence paiement</span>
                    <span className="font-medium">#{paiement[0].idPaiement}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Aucun paiement enregistré pour cette réservation
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rappel de réservation et Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rappel de réservation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Rappel de réservation
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Envoyez un email de rappel au client pour sa réservation prévue le{' '}
                {new Date(reservation.dateCheckIn).toLocaleDateString('fr-FR')}
              </p>
              <button
                onClick={handleSendReminder}
                disabled={isSending}
                className={`w-full ${isSending ? 'bg-blue-400' : 'bg-blue-600'} text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200`}
              >
                {isSending ? 'Envoi en cours...' : 'Envoyer un rappel email'}
              </button>
              <div className="text-sm text-gray-500 mt-2">
                L'email sera envoyé à {reservation.email}
              </div>
            </div>
          </div>

          {/* Notes et Demandes Spéciales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Notes et Demandes Spéciales
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Demandes spéciales</h3>
                <p className="text-yellow-700">Lit bébé requis, chambre calme si possible</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Notes internes</h3>
                <p className="text-blue-700">Client fidèle - 3ème séjour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;