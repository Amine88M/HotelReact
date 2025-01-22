import React from 'react';
import { Calendar, CreditCard, Users, Bed, Receipt, Clock } from 'lucide-react';

const SejourDisplay = ({
  id_sejour,
  reservation_Id,
  date_Checkin,
  date_Checkout,
  numChambre,
  caution,
  statut_Caution,
  montant_Total_Sejour,
  additionalGuests,
  consommations,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCautionStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-yellow-100 text-yellow-800';
      case 'PartiellementLibere':
        return 'bg-blue-100 text-blue-800';
      case 'TotallementLibere':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Détails du Séjour #{id_sejour}</h1>
        <p className="text-gray-600">Réservation #{reservation_Id}</p>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Dates */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium">{formatDate(date_Checkin)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium">{formatDate(date_Checkout)}</p>
            </div>
          </div>
        </div>

        {/* Room and Financial Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Bed className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Chambre</p>
              <p className="font-medium">N° {numChambre}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Receipt className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Montant Total</p>
              <p className="font-medium">{montant_Total_Sejour.toFixed(2)} €</p>
            </div>
          </div>
        </div>
      </div>

      {/* Caution Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Caution</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{caution} €</span>
          <span className={`px-3 py-1 rounded-full text-sm ${getCautionStatusColor(statut_Caution)}`}>
            {statut_Caution}
          </span>
        </div>
      </div>

      {/* Additional Guests */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Invités Supplémentaires</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalGuests.map((guest, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{guest.name}</p>
              {guest.age && <p className="text-sm text-gray-600">Age: {guest.age} ans</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Services Consumed */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Services Consommés</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consommations.map((service, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.price?.toFixed(2)} €</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SejourDisplay;