import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function CheckInModal() {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [guests, setGuests] = useState([]);
    const [services, setServices] = useState({
        breakfast: false,
        wifi: false,
        parking: false,
        roomService: false,
        laundry: false,
        spa: false,
    });

    // Fetch reservations data
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('https://localhost:7141/api/reservations');
                if (!response.ok) throw new Error('Failed to fetch reservations');
                const data = await response.json();
                const pendingReservations = data.filter(res => res.Statut === 'reserved');
                setReservations(pendingReservations);
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

    const handleReservationSelect = (e) => {
        const reservation = reservations.find(r => r.id_Reservation === parseInt(e.target.value));
        if (reservation) {
            setSelectedReservation(reservation);
            // Create guest entries based on total number of persons
            const totalGuests = reservation.NombreAdults + reservation.NombreEnfants;
            const newGuests = Array(totalGuests).fill().map((_, index) => ({
                name: index === 0 ? `${reservation.Nom} ${reservation.Prenom}` : '',
                cin: index === 0 ? reservation.CIN || '' : '',
                isChild: index >= reservation.NombreAdults,
                phone: index === 0 ? reservation.Telephone || '' : '',
                email: index === 0 ? reservation.email || '' : '',
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

        if (!selectedReservation || guests.some(guest => !guest.name || !guest.cin)) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all guest information',
                icon: 'error',
                confirmButtonColor: '#F8B1A5',
            });
            return;
        }

        try {
            const response = await fetch(`https://localhost:7141/api/reservations/${selectedReservation.id_Reservation}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...selectedReservation,
                    Statut: 'checked-in',
                    guests: guests,
                    services: services
                }),
            });

            if (!response.ok) throw new Error('Failed to update reservation status');

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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <h2 className="text-2xl font-bold text-white">Guest Check-in</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleCheckIn} className="space-y-6">
                        {/* Reservation Selection */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Select Reservation
                            </h3>
                            <select
                                onChange={handleReservationSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a reservation</option>
                                {reservations.map(reservation => (
                                    <option key={reservation.id_Reservation} value={reservation.id_Reservation}>
                                        {reservation.Nom} {reservation.Prenom} - Room: {reservation.id_Type_Chambre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedReservation && (
                            <>
                                {/* Reservation Details */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Reservation Details
                                    </h3>
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
                                            <p className="font-medium">{selectedReservation.id_Type_Chambre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Price</p>
                                            <p className="font-medium">${selectedReservation.PrixTotal}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Guest Information
                                    </h3>
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
                                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.name}
                                                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        readOnly={index === 0}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">CIN</label>
                                                    <input
                                                        type="text"
                                                        value={guest.cin}
                                                        onChange={(e) => handleGuestChange(index, 'cin', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                {index === 0 && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                            <input
                                                                type="tel"
                                                                value={guest.phone}
                                                                onChange={(e) => handleGuestChange(index, 'phone', e.target.value)}
                                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                                            <input
                                                                type="email"
                                                                value={guest.email}
                                                                onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Services */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Additional Services
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
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