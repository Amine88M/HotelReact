import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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

    // Fetch reservations for today
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('https://localhost:7141/api/reservations');
                if (!response.ok) throw new Error('Failed to fetch reservations');
                const data = await response.json();
                const todayReservations = data.filter(res => new Date(res.DateCheckIn).toDateString() === new Date().toDateString());
                setReservations(todayReservations);
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

    // Fetch available rooms for the selected room type
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

    // Handle reservation selection
    const handleReservationSelect = (e) => {
        const reservation = reservations.find(r => r.Id === parseInt(e.target.value));
        if (reservation) {
            setSelectedReservation(reservation);
            const totalGuests = reservation.NombreAdults + reservation.NombreEnfants;
            const newGuests = Array(totalGuests).fill().map((_, index) => ({
                Nom: index === 0 ? reservation.Nom : '',
                Prenom: index === 0 ? reservation.Prenom : '',
                CIN: index === 0 ? reservation.CIN || '' : '',
                isChild: index >= reservation.NombreAdults,
            }));
            setGuests(newGuests);
        }
    };

    // Handle guest input changes
    const handleGuestChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index] = {
            ...updatedGuests[index],
            [field]: value
        };
        setGuests(updatedGuests);
    };

    // Handle check-in submission
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
            RoomNumbers: availableRooms.map(room => room.NumChambre), // Assuming you select all available rooms
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
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-2xl font-bold text-white">Guest Check-in</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleCheckIn} className="space-y-6">
                        {/* Reservation Selection */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Reservation</h3>
                            <select
                                onChange={handleReservationSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a reservation</option>
                                {reservations.map(reservation => (
                                    <option key={reservation.Id} value={reservation.Id}>
                                        {reservation.Nom} {reservation.Prenom} - Room: {reservation.Id_Type_Chambre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedReservation && (
                            <>
                                {/* Reservation Details */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Check-in Date</p>
                                            <p className="font-medium">{new Date(selectedReservation.DateCheckIn).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Check-out Date</p>
                                            <p className="font-medium">{new Date(selectedReservation.DateCheckOut).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Room Type</p>
                                            <p className="font-medium">{selectedReservation.Id_Type_Chambre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Price</p>
                                            <p className="font-medium">${selectedReservation.PrixTotal}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                                    {guests.map((guest, index) => (
                                        <div key={index} className="mb-6 last:mb-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h4 className="font-medium text-gray-900">
                                                    {index === 0 ? 'Main Guest' : `Additional Guest ${index}`}
                                                </h4>
                                                {guest.isChild && (
                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                        Child
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.Nom}
                                                        onChange={(e) => handleGuestChange(index, 'Nom', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        readOnly={index === 0}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.Prenom}
                                                        onChange={(e) => handleGuestChange(index, 'Prenom', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        readOnly={index === 0}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">CIN</label>
                                                    <input
                                                        type="text"
                                                        value={guest.CIN}
                                                        onChange={(e) => handleGuestChange(index, 'CIN', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Services */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(services).map(([service, checked]) => (
                                            <div key={service} className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id={service}
                                                    checked={checked}
                                                    onChange={(e) => setServices(prev => ({
                                                        ...prev,
                                                        [service]: e.target.checked
                                                    }))}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={service} className="text-sm text-gray-700">
                                                    {service.charAt(0).toUpperCase() + service.slice(1)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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