import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCheck,
  FaPrint,
  FaTimes,
  FaTaxi,
  FaSpa,
  FaCoffee,
  FaUtensils,
  FaBasketballBall,
  FaFutbol,
  FaHotTub,
  FaFileInvoiceDollar,
  FaLink,
} from 'react-icons/fa';

export default function CheckinModal() {
  const [reservations, setReservations] = useState([]);
  const [sejours, setSejours] = useState([]); // State to store Sejour data
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [additionalGuests, setAdditionalGuests] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [cautionValue, setCautionValue] = useState(0);
  const [cautionStatus, setCautionStatus] = useState('Active');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default payment method
  const [selectedServices, setSelectedServices] = useState([]); // Track selected services
  const [totalAmount, setTotalAmount] = useState(0); // Total amount based on services
  const [selectedDateTime, setSelectedDateTime] = useState(''); // Track selected date and time
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);
  const [roomTypes, setRoomTypes] = useState({}); // State to store room types by ID

  const services = [
    { id_Service: 1, nom_Service: 'Taxi', icon: <FaTaxi />, tarif: 50 },
    { id_Service: 2, nom_Service: 'Spa', icon: <FaSpa />, tarif: 100 },
    { id_Service: 3, nom_Service: 'Petit-Dejeuner', icon: <FaCoffee />, tarif: 20 },
    { id_Service: 4, nom_Service: 'Dejeuner', icon: <FaUtensils />, tarif: 30 },
    { id_Service: 5, nom_Service: 'Dinner', icon: <FaUtensils />, tarif: 40 },
    { id_Service: 6, nom_Service: 'Terrain de Basket', icon: <FaBasketballBall />, tarif: 15 },
    { id_Service: 7, nom_Service: 'Terrain de FootBall', icon: <FaFutbol />, tarif: 20 },
    { id_Service: 8, nom_Service: 'Hamam', icon: <FaHotTub />, tarif: 60 },
  ];

  // Fetch today's check-ins
  useEffect(() => {
    const fetchTodayCheckIns = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/Reservations/today-checkins');
        if (!response.ok) {
          throw new Error('Failed to fetch today\'s check-ins');
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch today\'s check-ins',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
      }
    };

    fetchTodayCheckIns();
  }, []);

  // Fetch Sejour data
  useEffect(() => {
    const fetchSejours = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/Sejour');
        if (!response.ok) {
          throw new Error('Failed to fetch Sejours');
        }
        const data = await response.json();
        setSejours(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch Sejours',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
      }
    };

    fetchSejours();
  }, []);

  // Fetch room type by ID
  const fetchRoomTypeById = async (id) => {
    try {
      const response = await fetch(`https://localhost:7141/api/Reservations/room-type/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room type');
      }
      const data = await response.json();
      return data.text; // Return the room type name
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch room type',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return 'N/A'; // Return 'N/A' if the room type is not found
    }
  };

  // Fetch room types for all reservations
  useEffect(() => {
    const fetchRoomTypesForReservations = async () => {
      const roomTypesMap = {};
      for (const reservation of reservations) {
        if (reservation.id_Type_Chambre) {
          const roomTypeName = await fetchRoomTypeById(reservation.id_Type_Chambre);
          roomTypesMap[reservation.id_Type_Chambre] = roomTypeName;
        }
      }
      setRoomTypes(roomTypesMap);
    };

    fetchRoomTypesForReservations();
  }, [reservations]);

  // Filter reservations that are not in Sejour table
  const filteredReservations = reservations.filter(
    (reservation) => !sejours.some((sejour) => sejour.reservation_Id === reservation.id)
  );

  // Fetch available rooms
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/chambre/disponibles');
        if (!response.ok) {
          throw new Error('Failed to fetch available rooms');
        }
        const data = await response.json();
        setAvailableRooms(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch available rooms',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
      }
    };

    fetchAvailableRooms();
  }, []);

  // Filter available rooms by the selected reservation's TypeChambre
  const filteredRooms = selectedReservation
    ? availableRooms.filter((room) => room.id_Type_Chambre === selectedReservation.id_Type_Chambre)
    : [];

  // Get room type name by id
  const getRoomTypeName = (id) => {
    return roomTypes[id] || 'N/A';
  };

  // Handle reservation selection
  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation);

    // Initialize additional guests based on the number of adults in the reservation
    const newAdditionalGuests = Array(reservation.nombreAdults).fill().map((_, index) => ({
      nom: index === 0 ? reservation.nom : '', // Pre-fill the first guest's name
      prenom: index === 0 ? reservation.prenom : '', // Pre-fill the first guest's surname
      cin: '', // CIN field is empty initially
    }));

    setAdditionalGuests(newAdditionalGuests);
  };

  // Handle additional guest input change
  const handleAdditionalGuestChange = (index, field, value) => {
    const updatedGuests = [...additionalGuests];
    updatedGuests[index][field] = value;
    setAdditionalGuests(updatedGuests);
  };

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService({ ...service, quantite_Service: 1 }); // Initialize quantity to 1
    setShowServiceModal(true);
  };

  // Handle service date and time selection
  const handleServiceDateTimeSelect = async () => {
    if (!selectedReservation || !selectedService || !selectedDateTime) return;

    const selectedDate = new Date(selectedDateTime);
    const checkInDate = new Date(selectedReservation.dateCheckIn);
    const checkOutDate = new Date(selectedReservation.dateCheckOut);

    if (selectedDate < checkInDate || selectedDate > checkOutDate) {
      Swal.fire({
        title: 'Error!',
        text: 'Selected date and time must be between check-in and check-out dates.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }

    // Create a new service object with the selected date, time, and quantity
    const newService = {
      ...selectedService,
      date: selectedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      heure: selectedDate.toTimeString().split(' ')[0], // Format time as HH:MM:SS
      quantite_Service: selectedService.quantite_Service || 1, // Use the selected quantity
    };

    // Add the new service to the selectedServices array
    setSelectedServices([...selectedServices, newService]);

    // Close the service modal and reset the selected date/time
    setShowServiceModal(false);
    setSelectedDateTime('');
  };

  // Calculate total amount based on selected services and caution
  useEffect(() => {
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.tarif * service.quantite_Service, 0);
    const total = servicesTotal + parseFloat(cautionValue || 0);
    setTotalAmount(total);
  }, [selectedServices, cautionValue]);

  // Handle form submission to create Sejour and Payment
  const handleSubmit = async () => {
    if (!selectedReservation || !selectedRoomNumber) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a room before submitting.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }
  
    if (additionalGuests.some((guest) => !guest.nom || !guest.prenom || !guest.cin)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all guest information.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }
  
    // Create the Sejour payload (without id_sejour)
    const newSejour = {
      reservation_Id: parseInt(selectedReservation.id),
      date_Checkin: new Date(selectedReservation.dateCheckIn).toISOString().split('T')[0],
      date_Checkout: new Date(selectedReservation.dateCheckOut).toISOString().split('T')[0],
      numChambre: parseInt(selectedRoomNumber),
      montant_Total_Sejour: parseFloat(totalAmount),
      caution: parseFloat(cautionValue),
    };
  
    try {
      // Step 1: Create the Sejour
      const sejourResponse = await fetch('https://localhost:7141/api/Sejour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSejour),
      });
  
      if (!sejourResponse.ok) {
        const errorText = await sejourResponse.text();
        throw new Error('Failed to create Sejour');
      }
  
      const sejourData = await sejourResponse.json();
      const sejourId = sejourData.id_sejour; // Get the id_sejour from the created Sejour
  
      // Step 2: Fetch the created Sejour by reservation ID using the new endpoint
      const fetchSejourResponse = await fetch(`https://localhost:7141/api/Sejour/reservation-details/${selectedReservation.id}`);
      if (!fetchSejourResponse.ok) {
        throw new Error('Failed to fetch Sejour');
      }
      const fetchedSejour = await fetchSejourResponse.json();
  
      // Step 3: Create GuestInfo with the Sejour ID
      const guestInfosPayload = additionalGuests.map((guest) => ({
        nom: guest.nom,
        prenom: guest.prenom,
        cin: guest.cin,
        id_Sejour: sejourId, // Link to the newly created Sejour
      }));
  
      const guestsResponse = await fetch('https://localhost:7141/api/GuestInfo/Bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestInfosPayload),
      });
  
      if (!guestsResponse.ok) {
        const errorText = await guestsResponse.text();
        throw new Error('Failed to create GuestInfo');
      }
  
      // Step 4: Check if a Paiement already exists for this reservation
      const paiementsResponse = await fetch(
        `https://localhost:7141/api/paiements/reservation/${selectedReservation.id}`
      );
      if (!paiementsResponse.ok) {
        const errorText = await paiementsResponse.text();
        throw new Error('Failed to fetch paiements');
      }
  
      const paiements = await paiementsResponse.json();
  
      let paiement;
  
      if (paiements.length > 0) {
        // Update existing Paiement
        paiement = paiements[0];
        paiement.montant += parseFloat(totalAmount);
        paiement.sejourId = sejourId; // Link to the newly created Sejour
  
        const updateResponse = await fetch(
          `https://localhost:7141/api/paiements/reservation/${selectedReservation.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paiement),
          }
        );
  
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error('Failed to update Paiement');
        }
      } else {
        // Create new Paiement
        const newPayment = {
          reservationId: parseInt(selectedReservation.id),
          montant: parseFloat(totalAmount),
          methodPaiement: paymentMethod,
          datePaiement: new Date().toISOString(),
          statutPaiement: 1, // Payé
          sejourId: sejourId, // Link to the newly created Sejour
        };
  
        const createResponse = await fetch('https://localhost:7141/api/paiements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPayment),
        });
  
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error('Failed to create Paiement');
        }
      }
  
      // Step 5: Create ConsommationService for each selected service
      for (const service of selectedServices) {
        const consommationServicePayload = {
          id_Service: service.id_Service,
          id_Sejour: sejourId, // Link to the newly created Sejour
          date: service.date,
          heure: service.heure,
          quantite_Service: service.quantite_Service, // Include the quantity
        };
  
        const consommationServiceResponse = await fetch(
          'https://localhost:7141/api/ConsommationService',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(consommationServicePayload),
          }
        );
  
        if (!consommationServiceResponse.ok) {
          const errorText = await consommationServiceResponse.text();
          throw new Error('Failed to create ConsommationService');
        }
      }
  
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Check-in completed successfully and room status updated to Occupée.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });
  
      // Reset the form after successful submission
      setSelectedReservation(null);
      setAdditionalGuests([]);
      setSelectedServices([]);
      setCautionValue(0);
      setCautionStatus('Active');
      setTotalAmount(0);
      setSelectedRoomNumber(null);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to complete check-in.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-visible">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-3xl font-bold text-white">Today's Check-Ins</h2>
        </div>

        <div className="p-6">
          {/* Display reservations and handle selection */}
          {filteredReservations.length === 0 ? (
            <p className="text-center text-gray-500">No reservations for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.nom} {reservation.prenom}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.dateCheckIn).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.dateCheckOut).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRoomTypeName(reservation.id_Type_Chambre)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReservationSelect(reservation)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReservation && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Reservation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reservation ID</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Guest Name</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedReservation.nom} {selectedReservation.prenom}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Check-In Date</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(selectedReservation.dateCheckIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Check-Out Date</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(selectedReservation.dateCheckOut).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Room Type</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {getRoomTypeName(selectedReservation.id_Type_Chambre)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Adults</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedReservation.nombreAdults}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Children</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedReservation.nombreEnfants}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rooms</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                >
                  <option value="">Select a room</option>
                  {filteredRooms.map((room) => (
                    <option key={room.numChambre} value={room.numChambre}>
                      Room {room.numChambre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Caution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caution Value</label>
                    <input
                      type="number"
                      value={cautionValue}
                      onChange={(e) => setCautionValue(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caution Status</label>
                    <select
                      value={cautionStatus}
                      onChange={(e) => setCautionStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Active">Active</option>
                      <option value="PartiellementLibere">Partiellement Libéré</option>
                      <option value="TotallementLibere">Totalement Libéré</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Guests</h3>
                {additionalGuests.map((guest, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={guest.nom}
                          onChange={(e) => handleAdditionalGuestChange(index, 'nom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          readOnly={index === 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={guest.prenom}
                          onChange={(e) => handleAdditionalGuestChange(index, 'prenom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          readOnly={index === 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                        <input
                          type="text"
                          value={guest.cin}
                          onChange={(e) => handleAdditionalGuestChange(index, 'cin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id_Service}
                      onClick={() => handleServiceSelect(service)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center"
                    >
                      {service.icon}
                      <span className="ml-2">{service.nom_Service}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Services</h3>
                <div className="space-y-4">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-semibold">{service.nom_Service}</p>
                          <p className="text-sm text-gray-500">Date: {service.date}, Time: {service.heure}</p>
                          <p className="text-sm text-gray-500">Quantity: {service.quantite_Service}</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">${service.tarif * service.quantite_Service}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Total Amount</h3>
                <p className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h3>
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
                  <button
                    onClick={() => setPaymentMethod('cheque')}
                    className={`px-4 py-2 rounded-md flex items-center justify-center ${
                      paymentMethod === 'cheque' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FaFileInvoiceDollar className="mr-2" />
                    Cheque
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCheck className="mr-2" />
                  Submit
                </button>
              </div>
            </div>
          )}

          {showServiceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date and Time for {selectedService.nom_Service}</h3>
                <input
                  type="datetime-local"
                  min={new Date(selectedReservation.dateCheckIn).toISOString().slice(0, 16)}
                  max={new Date(selectedReservation.dateCheckOut).toISOString().slice(0, 16)}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={selectedService.quantite_Service || 1}
                  onChange={(e) => setSelectedService({ ...selectedService, quantite_Service: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleServiceDateTimeSelect}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}