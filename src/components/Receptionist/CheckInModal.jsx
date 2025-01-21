import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function CheckinModal() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [additionalGuests, setAdditionalGuests] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [cautionValue, setCautionValue] = useState(0);
  const [cautionStatus, setCautionStatus] = useState('Active');
  const [services, setServices] = useState([
    { id_Service: 1, nom_Service: 'Taxi' },
    { id_Service: 2, nom_Service: 'Spa' },
    { id_Service: 3, nom_Service: 'Petit-Dejeuner' },
    { id_Service: 4, nom_Service: 'Dejeuner' },
    { id_Service: 5, nom_Service: 'Dinner' },
    { id_Service: 6, nom_Service: 'Terrain de Basket' },
    { id_Service: 7, nom_Service: 'Terrain de FootBall' },
    { id_Service: 8, nom_Service: 'Hamam' },
  ]);

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

  // Handle reservation selection
  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation);
    // Initialize additional guests based on the number of adults in the reservation
    const newAdditionalGuests = Array(reservation.nombreAdults - 1).fill().map(() => ({
      nom: '',
      prenom: '',
      cin: '',
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
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // Handle service date and time selection
  const handleServiceDateTimeSelect = async (dateTime) => {
    if (!selectedReservation || !selectedService) return;

    // Validate that the selected date and time are within the reservation's check-in and check-out dates
    const selectedDate = new Date(dateTime);
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

    // Create a new ConsommationService
    const newConsommationService = {
      id_Service: selectedService.id_Service, // Assuming selectedService has an Id_Service
      id_sejour: selectedReservation.id, // Use the ID of the selected reservation
      date: selectedDate.toISOString().split('T')[0], // Extract date part
      heure: selectedDate.toTimeString().split(' ')[0], // Extract time part
      quantite_Service: 1, // Default quantity (can be modified)
    };

    // Send the new ConsommationService to the API
    try {
      const consommationResponse = await fetch('https://localhost:7141/api/ConsommationService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConsommationService),
      });

      if (!consommationResponse.ok) {
        throw new Error('Failed to create ConsommationService');
      }

      Swal.fire({
        title: 'Success!',
        text: 'Service added successfully.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add service',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
    }

    setShowServiceModal(false);
  };

  // Handle form submission to create Sejour
  const handleSubmit = async () => {
    if (!selectedReservation) return;

    // Validate that all required fields are filled
    if (additionalGuests.some((guest) => !guest.nom || !guest.prenom || !guest.cin)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all guest information.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5',
      });
      return;
    }

    // Create a new Sejour
    const newSejour = {
      id_sejour: selectedReservation.id, // Use ReservationId as Id_sejour
      reservation_Id: selectedReservation.id,
      date_Checkin: selectedReservation.dateCheckIn,
      date_Checkout: selectedReservation.dateCheckOut,
      numChambre: selectedReservation.id_Type_Chambre, // Example: Use room type ID as room number
      statut_Caution: cautionStatus, // Use selected caution status
      montant_Total_Sejour: 0, // Calculate total later
      additionalGuests: additionalGuests, // Include additional guests
      caution: cautionValue, // Include caution value
    };

    // Send the new Sejour to the API
    try {
      const sejourResponse = await fetch('https://localhost:7141/api/Sejour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSejour),
      });

      if (!sejourResponse.ok) {
        throw new Error('Failed to create Sejour');
      }

      Swal.fire({
        title: 'Success!',
        text: 'Sejour created successfully.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create Sejour',
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
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
                    {selectedReservation.typeChambre?.nom_Type_Chambre}
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
                  onChange={(e) => setSelectedReservation({ ...selectedReservation, numChambre: e.target.value })}
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
                <div className="grid grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id_Service}
                      onClick={() => handleServiceSelect(service)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {service.nom_Service}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
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
                  onChange={(e) => handleServiceDateTimeSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}