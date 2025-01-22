import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaCreditCard, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';

export default function CheckOutComponent() {
  const [sejours, setSejours] = useState([]); // State to store Sejours with today's checkout
  const [selectedSejour, setSelectedSejour] = useState(null); // State to store the selected Sejour
  const [paiements, setPaiements] = useState([]); // State to store Paiements for the selected Sejour
  const [cautionRetrieve, setCautionRetrieve] = useState(0); // State to store caution retrieve amount
  const [paymentMethod, setPaymentMethod] = useState('cash'); // State to store payment method
  const [totalAmount, setTotalAmount] = useState(0); // State to store total amount
  const [montantRestant, setMontantRestant] = useState(0); // State to store remaining amount

  // Fetch Sejours with today's checkout date
  useEffect(() => {
    const fetchSejours = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/Sejour/today-checkouts');
        if (!response.ok) throw new Error('Failed to fetch Sejours');
        const data = await response.json();
        setSejours(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch Sejours with today\'s checkout date.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
      }
    };

    fetchSejours();
  }, []);

  // Handle Sejour selection
  const handleSejourSelect = async (sejour) => {
    setSelectedSejour(sejour);

    // Fetch Paiements for the selected Sejour
    try {
      const paiementsResponse = await fetch(`https://localhost:7141/api/Paiements/reservation/${sejour.reservation_Id}`);
      if (!paiementsResponse.ok) throw new Error('Failed to fetch Paiements');
      const paiementsData = await paiementsResponse.json();
      setPaiements(paiementsData);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch Paiements.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  // Calculate Montant Restant
  useEffect(() => {
    if (!selectedSejour || !paiements) return;

    const reservationMontant = selectedSejour.reservation?.prixTotal || 0; // Room price * nights
    const totalPaiements = paiements.reduce((sum, paiement) => sum + paiement.montant, 0);
    const montantRestantCalc =
      selectedSejour.montant_Total_Sejour - totalPaiements + reservationMontant - selectedSejour.caution + cautionRetrieve;

    setMontantRestant(montantRestantCalc);
    setTotalAmount(montantRestantCalc);
  }, [selectedSejour, paiements, cautionRetrieve]);

  // Handle checkout submission
  const handleCheckOut = async (e) => {
    e.preventDefault();

    if (!selectedSejour) {
      Swal.fire({
        title: 'Error!',
        text: 'No Sejour selected for checkout.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }

    try {
      // Update Sejour's Caution Status to "TotallementLibere"
      const updateCautionResponse = await fetch(`https://localhost:7141/api/Sejour/${selectedSejour.id_sejour}/caution-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(2), // 2 = TotallementLibere
      });

      if (!updateCautionResponse.ok) throw new Error('Failed to update caution status');

      // Create a new Paiement for the remaining amount
      const newPaiement = {
        reservationId: selectedSejour.reservation_Id,
        montant: totalAmount,
        methodPaiement: paymentMethod,
        datePaiement: new Date().toISOString(),
        statutPaiement: 1, // Payé
        sejourId: selectedSejour.id_sejour,
      };

      const createPaiementResponse = await fetch('https://localhost:7141/api/Paiements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPaiement),
      });

      if (!createPaiementResponse.ok) throw new Error('Failed to create Paiement');

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Checkout completed successfully.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to complete checkout.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Check-out</h3>

      {/* List of Sejours with today's checkout */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">Sejours with Today's Checkout</h4>
        <div className="space-y-4">
          {sejours.map((sejour) => (
            <div
              key={sejour.id_sejour}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSejourSelect(sejour)}
            >
              <p className="text-lg font-semibold text-gray-900">
                Room {sejour.numChambre} - {sejour.reservation?.nom} {sejour.reservation?.prenom}
              </p>
              <p className="text-sm text-gray-500">
                Check-in: {new Date(sejour.date_Checkin).toLocaleDateString()} | Check-out: {new Date(sejour.date_Checkout).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Sejour Details */}
      {selectedSejour && (
        <>
          {/* Guest Information */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Guest Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSejour.reservation?.nom} {selectedSejour.reservation?.prenom}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CIN</p>
                <p className="text-lg font-semibold text-gray-900">{selectedSejour.additionalGuests[0]?.cin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Check-in Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(selectedSejour.date_Checkin).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Check-out Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(selectedSejour.date_Checkout).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Room Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Room Number</p>
                <p className="text-lg font-semibold text-gray-900">{selectedSejour.numChambre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Room Type</p>
                <p className="text-lg font-semibold text-gray-900">{selectedSejour.reservation?.typeChambre?.nom_Type_Chambre || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Payment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Caution Retrieve</p>
                <input
                  type="number"
                  value={cautionRetrieve}
                  onChange={(e) => setCautionRetrieve(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Payment Method</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`px-4 py-2 rounded-md flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FaMoneyBillWave className="mr-2" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`px-4 py-2 rounded-md flex items-center justify-center ${
                  paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FaCreditCard className="mr-2" />
                Card
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaCheck className="mr-2" />
              Confirm Check-out
            </button>
          </div>
        </>
      )}
    </div>
  );
}