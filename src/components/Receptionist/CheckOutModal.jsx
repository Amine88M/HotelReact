import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaCreditCard, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';

export default function CheckOutComponent() {
  const [sejours, setSejours] = useState([]);
  const [selectedSejour, setSelectedSejour] = useState({
    id_sejour: null,
    reservation_Id: null,
    numChambre: null,
    date_Checkin: null,
    date_Checkout: null,
    guestName: 'N/A',
    cin: 'N/A',
    roomType: 'N/A',
  });
  const [paiements, setPaiements] = useState([]);
  const [cautionRetrieve, setCautionRetrieve] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [totalAmount, setTotalAmount] = useState(0);
  const [montantRestant, setMontantRestant] = useState(0);

  // Fetch Sejours with today's checkout date
  useEffect(() => {
    const fetchSejours = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/Sejour/today-checkouts');
        if (!response.ok) throw new Error('Failed to fetch Sejours');
        const data = await response.json();

        // Filter Sejours where checkout time is 14:00 or later
        const filteredSejours = data.filter((sejour) => {
          const checkoutDate = new Date(sejour.date_Checkout);
          const checkoutHour = checkoutDate.getHours();
          return checkoutHour >= 14; // Only include Sejours with checkout time >= 14:00
        });

        setSejours(filteredSejours);
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

    try {
      // Fetch Paiements for the selected Sejour
      const paiementsResponse = await fetch(
        `https://localhost:7141/api/Paiements/reservation/${sejour.reservation_Id}`
      );
      if (!paiementsResponse.ok) throw new Error('Failed to fetch Paiements');
      const paiementsData = await paiementsResponse.json();
      setPaiements(paiementsData);

      // Fetch GuestInfo for the selected Sejour
      const guestInfoResponse = await fetch('https://localhost:7141/api/GuestInfo');
      if (!guestInfoResponse.ok) throw new Error('Failed to fetch GuestInfo');
      const guestInfos = await guestInfoResponse.json();

      // Find the primary guest (assuming the first guest is the primary)
      const primaryGuest = guestInfos.find((guest) => guest.id_sejour === sejour.id_sejour);

      // Fetch the reservation details to get the id_Type_Chambre
      const reservationResponse = await fetch(
        `https://localhost:7141/api/reservations/${sejour.reservation_Id}`
      );
      if (!reservationResponse.ok) throw new Error('Failed to fetch reservation details');
      const reservationData = await reservationResponse.json();

      // Fetch the room type name using the id_Type_Chambre from the reservation
      let roomType = 'N/A';
      if (reservationData.id_Type_Chambre) {
        const roomTypeResponse = await fetch(
          `https://localhost:7141/api/reservations/room-type/${reservationData.id_Type_Chambre}`
        );
        if (roomTypeResponse.ok) {
          const roomTypeData = await roomTypeResponse.json();
          roomType = roomTypeData.text; // Use the room type name (nom_type_chambre)
        }
      }

      // Update the selected Sejour with guest and room type details
      setSelectedSejour((prevSejour) => ({
        ...prevSejour,
        guestName: primaryGuest ? `${primaryGuest.nom} ${primaryGuest.prenom}` : 'N/A',
        cin: primaryGuest?.cin || 'N/A',
        roomType,
      }));
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch guest or room type details.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  // Calculate Montant Restant
  useEffect(() => {
    if (!selectedSejour || !paiements) return;

    const reservationMontant = selectedSejour.reservation?.prixTotal || 0;
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
      const updateCautionResponse = await fetch(
        `https://localhost:7141/api/Sejour/${selectedSejour.id_sejour}/caution-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(2), // 2 = TotallementLibere
        }
      );

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

      // Update the room status to "Disponible"
      const updateRoomStatusResponse = await fetch(
        `https://localhost:7141/api/chambre/${selectedSejour.numChambre}/update-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(0), // 0 = Disponible
        }
      );

      if (!updateRoomStatusResponse.ok) throw new Error('Failed to update room status');

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Checkout completed successfully and room status updated to Disponible.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });

      // Reset the selected Sejour after successful checkout
      setSelectedSejour({
        id_sejour: null,
        reservation_Id: null,
        numChambre: null,
        date_Checkin: null,
        date_Checkout: null,
        guestName: 'N/A',
        cin: 'N/A',
        roomType: 'N/A',
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
        {sejours.length === 0 ? (
          <h5 className="text-gray-500">Pas de checkout!!</h5>
        ) : (
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
        )}
      </div>

      {/* Selected Sejour Details */}
      {selectedSejour && selectedSejour.id_sejour && (
        <>
          {/* Guest Information */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Guest Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSejour.guestName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CIN</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSejour.cin || 'N/A'}
                </p>
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
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSejour.numChambre}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Room Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSejour.roomType || 'N/A'}
                </p>
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