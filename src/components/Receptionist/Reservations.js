import React from 'react';
import { Link } from 'react-router-dom';

export default function Reservations() {
  const reservations = [
    { id: 1, nom: "El Amrani", prenom: "Mohamed", dateReservation: "01/01/2024", dateArrivee: "05/01/2024", dateDepart: "10/01/2024" },
    { id: 2, nom: "Bouazza", prenom: "Fatima", dateReservation: "02/01/2024", dateArrivee: "06/01/2024", dateDepart: "11/01/2024" },
    { id: 3, nom: "Benjelloun", prenom: "Yassine", dateReservation: "03/01/2024", dateArrivee: "07/01/2024", dateDepart: "12/01/2024" },
    { id: 4, nom: "Tazi", prenom: "Amina", dateReservation: "04/01/2024", dateArrivee: "08/01/2024", dateDepart: "13/01/2024" },
    { id: 5, nom: "El Fassi", prenom: "Omar", dateReservation: "05/01/2024", dateArrivee: "09/01/2024", dateDepart: "14/01/2024" },
    { id: 6, nom: "Chafai", prenom: "Salma", dateReservation: "06/01/2024", dateArrivee: "10/01/2024", dateDepart: "15/01/2024" },
    { id: 7, nom: "Haji", prenom: "Khalid", dateReservation: "07/01/2024", dateArrivee: "11/01/2024", dateDepart: "16/01/2024" },
    { id: 8, nom: "Rhani", prenom: "Najat", dateReservation: "08/01/2024", dateArrivee: "12/01/2024", dateDepart: "17/01/2024" },
    { id: 9, nom: "Bennis", prenom: "Nabil", dateReservation: "09/01/2024", dateArrivee: "13/01/2024", dateDepart: "18/01/2024" },
    { id: 10, nom: "Ouazzani", prenom: "Asma", dateReservation: "10/01/2024", dateArrivee: "14/01/2024", dateDepart: "19/01/2024" },
    { id: 11, nom: "Jalali", prenom: "Reda", dateReservation: "11/01/2024", dateArrivee: "15/01/2024", dateDepart: "20/01/2024" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Liste des Réservations</h1>
        <div className="flex gap-2">
          <Link
            to="/create-reservation"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Ajouter une Réservation
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Supprimer la sélection
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="w-12 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de Réservation
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'Arrivée
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de Départ
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.nom}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.prenom}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.dateReservation}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.dateArrivee}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.dateDepart}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <button className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}