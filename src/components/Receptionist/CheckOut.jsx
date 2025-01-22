import React, { useState, useEffect } from 'react';
import { Search, Filter, Receipt, CreditCard, Printer } from 'lucide-react';
import axios from 'axios';

export default function CheckOut() {
  const [checkOuts, setCheckOuts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);

  // Fetch Sejours with past checkout dates
  useEffect(() => {
    const fetchSejours = async () => {
      try {
        const response = await axios.get('https://localhost:7141/api/Sejour/past-checkouts');
        const sejours = response.data;

        // Fetch guest names for each Sejour
        const sejoursWithGuestNames = await Promise.all(
          sejours.map(async (sejour) => {
            const reservationResponse = await axios.get(`https://localhost:7141/api/Reservations/${sejour.reservation_Id}`);
            const guestName = `${reservationResponse.data.nom} ${reservationResponse.data.prenom}`; // Assuming NomClient is the guest name
            return {
              ...sejour,
              guestName,
            };
          })
        );

        setCheckOuts(sejoursWithGuestNames);
      } catch (error) {
        console.error('Error fetching sejours:', error);
      }
    };

    fetchSejours();
  }, []);

  // Filter and sort logic
  const filteredCheckOuts = checkOuts.filter((checkOut) => {
    const searchText = searchTerm.toLowerCase();
    return (
      checkOut.guestName.toLowerCase().includes(searchText) ||
      checkOut.reservation_Id.toString().includes(searchText) ||
      checkOut.numChambre.toString().includes(searchText)
    );
  });

  const sortedCheckOuts = [...filteredCheckOuts].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.montant_Total_Sejour - a.montant_Total_Sejour;
    }
    return 0;
  });

  const handlePayment = (id) => {
    setCheckOuts((prevCheckOuts) =>
      prevCheckOuts.map((checkOut) =>
        checkOut.id_sejour === id ? { ...checkOut, paymentStatus: 'Paid' } : checkOut
      )
    );
  };

  const handlePrintInvoice = (id) => {
    console.log(`Printing invoice for checkout ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">List des Check-outs</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <Receipt size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">
              Total Checkouts: {checkOuts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by guest name, reservation ID, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setSortBy((prev) => (prev === 'amount' ? null : 'amount'))}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter size={20} />
          Sort by Amount
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num Séjour</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num Réservation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Checkout</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut Caution</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCheckOuts.map((checkOut) => (
              <tr key={checkOut.id_sejour} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{checkOut.id_sejour}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkOut.reservation_Id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkOut.guestName}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(checkOut.date_Checkout).toLocaleDateString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkOut.statut_caution}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${checkOut.montant_Total_Sejour.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayment(checkOut.id_sejour)}
                      className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
                    >
                      <CreditCard size={16} />
                      Pay
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(checkOut.id_sejour)}
                      className="flex items-center gap-1 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                    >
                      <Printer size={16} />
                      Facture
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}