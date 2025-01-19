import React from 'react';
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
  Coffee
} from 'lucide-react';

const Details = ({ reservation }) => {
  // Exemple de données de réservation
  const sampleReservation = {
    id: "RES-2024-001",
    status: "confirmed",
    guest: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      address: "123 Rue de Paris, 75001 Paris",
      nationality: "French",
      idType: "Passport",
      idNumber: "PAB123456",
    },
    stay: {
      checkIn: "2024-01-20T14:00:00",
      checkOut: "2024-01-25T12:00:00",
      numberOfNights: 5,
      roomType: "Chambre Deluxe",
      roomNumber: "304",
      adults: 2,
      children: 1,
    },
    payment: {
      totalAmount: 750.00,
      paid: 250.00,
      remaining: 500.00,
      paymentMethod: "Carte Bancaire",
      paymentStatus: "Acompte versé",
    },
    services: [
      { name: "Petit-déjeuner", price: 15, perDay: true },
      { name: "Parking", price: 20, perDay: true },
    ],
    specialRequests: "Lit bébé requis, chambre calme si possible",
    notes: "Client fidèle - 3ème séjour"
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête de réservation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Réservation #{sampleReservation.id}</h1>
              <div className="mt-1 flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  sampleReservation.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {sampleReservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
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
                  <span className="font-medium">{sampleReservation.guest.name}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="mr-2" size={16} />
                  <span>{sampleReservation.guest.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="mr-2" size={16} />
                  <span>{sampleReservation.guest.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2" size={16} />
                  <span>{sampleReservation.guest.address}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <AlertCircle className="mr-2" size={16} />
                  <span>ID: {sampleReservation.guest.idType} - {sampleReservation.guest.idNumber}</span>
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
              Détails du Séjour
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>Check-in</span>
                </div>
                <span className="font-medium">
                  {new Date(sampleReservation.stay.checkIn).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>Check-out</span>
                </div>
                <span className="font-medium">
                  {new Date(sampleReservation.stay.checkOut).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-2" size={16} />
                  <span>Durée</span>
                </div>
                <span className="font-medium">{sampleReservation.stay.numberOfNights} nuits</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center text-gray-700">
                  <BedDouble className="mr-2" size={16} />
                  <span>Chambre</span>
                </div>
                <span className="font-medium">{sampleReservation.stay.roomType} - {sampleReservation.stay.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center text-gray-700">
                  <Users className="mr-2" size={16} />
                  <span>Occupants</span>
                </div>
                <span className="font-medium">
                  {sampleReservation.stay.adults} adultes, {sampleReservation.stay.children} enfant
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
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Montant total</span>
                <span className="font-medium">{sampleReservation.payment.totalAmount} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Payé</span>
                <span className="font-medium text-green-600">{sampleReservation.payment.paid} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Restant à payer</span>
                <span className="font-medium text-red-600">{sampleReservation.payment.remaining} €</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center text-gray-700">
                  <CreditCard className="mr-2" size={16} />
                  <span>Mode de paiement</span>
                </div>
                <span className="font-medium">{sampleReservation.payment.paymentMethod}</span>
              </div>
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
              {sampleReservation.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-gray-700">{service.name}</span>
                  <span className="font-medium">
                    {service.price} € {service.perDay ? '/ jour' : ''}
                  </span>
                </div>
              ))}
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
                <p className="text-yellow-700">{sampleReservation.specialRequests}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Notes internes</h3>
                <p className="text-blue-700">{sampleReservation.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;