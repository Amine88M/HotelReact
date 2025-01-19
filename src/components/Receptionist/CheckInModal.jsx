import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';

// Checkbox component
const Checkbox = ({ id, checked, onCheckedChange, label }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor={id} className="ml-3 block text-sm text-gray-900">
      {label}
    </label>
  </div>
);

export default function CheckInModal() {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [guests, setGuests] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [services, setServices] = useState({
        petitDejeuner: false,
        spa: false,
        piscine: false,
        taxi: false,
        dejeuner: false,
    });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('https://localhost:7141/api/CheckIn/GetTodayReservations');
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const data = await response.json();
                console.log('Fetched reservations:', data); // Debug
                setReservations(data);
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch reservations',
                    icon: 'error',
                    confirmButtonColor: '#F8B1A5',
                });
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        if (selectedReservation) {
            const fetchAvailableRooms = async () => {
                try {
                    const response = await fetch(`https://localhost:7141/api/checkin/GetAvailableRooms?typeId=${selectedReservation.Id_Type_Chambre}`);
                    if (!response.ok) throw new Error('Failed to fetch available rooms');
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
        }
    }, [selectedReservation]);

    const handleReservationSelect = (selectedOption) => {
        console.log('Selected Option:', selectedOption);
        const reservation = reservations.find(r => r.id === selectedOption.value);
        if (reservation) {
            setSelectedReservation(reservation);
            const totalGuests = reservation.nombreAdults + reservation.nombreEnfants;
            const newGuests = Array(totalGuests).fill().map((_, index) => ({
                nom: index === 0 ? reservation.nom : '',
                prenom: index === 0 ? reservation.prenom : '',
                
                isChild: index >= reservation.nombreAdults,
            }));
            setGuests(newGuests);
        }
    };

    const handleGuestChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index] = {
            ...updatedGuests[index],
            [field]: value
        };
        setGuests(updatedGuests);
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();

        if (!selectedReservation || guests.some(guest => !guest.Nom || !guest.Prenom || !guest.CIN)) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all guest information',
                icon: 'error',
                confirmButtonColor: '#F8B1A5',
            });
            return;
        }

        const checkInData = {
            ReservationId: selectedReservation.Id,
            Nom: selectedReservation.Nom,
            Prenom: selectedReservation.Prenom,
            CIN: selectedReservation.CIN,
            AdditionalGuests: guests.slice(1).map(guest => ({
                Nom: guest.Nom,
                Prenom: guest.Prenom,
                CIN: guest.CIN,
            })),
            RoomNumbers: availableRooms.map(room => room.NumChambre),
            Services: Object.keys(services).filter(service => services[service]),
            CheckInDate: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://localhost:7141/api/checkin/CompleteCheckIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkInData),
            });

            if (!response.ok) throw new Error('Failed to complete check-in');

            Swal.fire({
                title: 'Success!',
                text: 'Check-in completed successfully',
                icon: 'success',
                confirmButtonColor: '#8CD4B9',
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to complete check-in',
                icon: 'error',
                confirmButtonColor: '#F8B1A5',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-3xl font-bold text-white">Guest Check-in</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleCheckIn} className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Reservation</h3>
                            <Select
                                className="w-full text-lg"
                                options={reservations.map(reservation => ({
                                    value: reservation.id,
                                    label: `${reservation.nom} ${reservation.prenom} - Room: ${reservation.id_Type_Chambre}`
                                }))}
                                onChange={handleReservationSelect}
                                placeholder="Select a reservation"
                            />
                        </div>

                        {selectedReservation && (
                            <>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Reservation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Reservation ID</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.Id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Guest Name</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{`${selectedReservation.Nom} ${selectedReservation.Prenom}`}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Check-in Date</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{new Date(selectedReservation.DateCheckIn).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Check-out Date</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{new Date(selectedReservation.DateCheckOut).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Room Type</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.Id_Type_Chambre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Price</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">${selectedReservation.PrixTotal}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Number of Adults</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.NombreAdults}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Number of Children</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.NombreEnfants}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Guest Information</h3>
                                    {guests.map((guest, index) => (
                                        <div key={index} className="mb-8 last:mb-0 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-4">
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    {index === 0 ? 'Main Guest' : `Additional Guest ${index}`}
                                                </h4>
                                                {guest.isChild && (
                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                        Child
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.Nom}
                                                        onChange={(e) => handleGuestChange(index, 'Nom', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                        required
                                                        readOnly={index === 0}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.Prenom}
                                                        onChange={(e) => handleGuestChange(index, 'Prenom', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                        required
                                                        readOnly={index === 0}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                                                    <input
                                                        type="text"
                                                        value={guest.CIN}
                                                        onChange={(e) => handleGuestChange(index, 'CIN', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Services</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(services).map(([service, checked]) => (
                                            <Checkbox
                                                key={service}
                                                id={service}
                                                checked={checked}
                                                onCheckedChange={(checked) => setServices(prev => ({
                                                    ...prev,
                                                    [service]: checked
                                                }))}
                                                label={service.charAt(0).toUpperCase() + service.slice(1)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Complete Check-in
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

