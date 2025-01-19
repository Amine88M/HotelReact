import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID de l'URL
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

const ReservationDetails = () => {
  const { id } = useParams(); // Récupère l'ID de l'URL
  const [reservation, setReservation] = useState(null);
  const [paiement, setPaiement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Modifier
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Annuler
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
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      paiement[0].statutPaiement === 0 
                        ? 'bg-yellow-100 text-yellow-800'
                        : paiement[0].statutPaiement === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {paiement[0].statutPaiement === 0 ? 'En attente' :
                       paiement[0].statutPaiement === 1 ? 'Payé' : 'Annulé'}
                    </span>
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

        {/* Services et Demandes spéciales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Coffee className="mr-2" size={20} />
              Services Additionnels
            </h2>
            <div className="space-y-3">
              {/* Exemple de services (à adapter selon les données de l'API) */}
              <div className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-gray-700">Petit-déjeuner</span>
                <span className="font-medium">15 € / jour</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-gray-700">Parking</span>
                <span className="font-medium">20 € / jour</span>
              </div>
            </div>
          </div>

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