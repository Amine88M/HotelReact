import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';

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
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [formData, setFormData] = useState({
        ModePaiement: '',
        email: '',
        constat: '1000'
    });
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
                console.log('Fetched reservations:', data); // Debug log
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
                    const response = await fetch(`https://localhost:7141/api/CheckIn/GetAvailableRooms?typeId=${selectedReservation.id_Type_Chambre}`);
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
            // Only create guest entries for adults
            const newGuests = Array(selectedReservation.nombreAdults).fill().map((_, index) => ({
                nom: index === 0 ? selectedReservation.nom : '',
                prenom: index === 0 ? selectedReservation.prenom : '',
                cin: '',
            }));
            setGuests(newGuests);
        }
    }, [selectedReservation]);

    const handleReservationSelect = (selectedOption) => {
        if (!selectedOption) {
            setSelectedReservation(null);
            return;
        }
        const reservation = reservations.find(r => r.id === selectedOption.value);
        setSelectedReservation(reservation);
    };

    const handleGuestChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index] = {
            ...updatedGuests[index],
            [field]: value
        };
        setGuests(updatedGuests);
    };

    const handleRoomSelect = (selectedOptions) => {
        setSelectedRooms(selectedOptions);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();

        if (!selectedReservation || guests.some(guest => !guest.nom || !guest.prenom || !guest.cin)) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all guest information',
                icon: 'error',
                confirmButtonColor: '#F8B1A5',
            });
            return;
        }

        const checkInData = {
            ReservationId: selectedReservation.id,
            Nom: selectedReservation.nom,
            Prenom: selectedReservation.prenom,
            CIN: selectedReservation.CIN,
            AdditionalGuests: guests.slice(1),
            RoomNumbers: selectedRooms.map(room => room.value),
            Services: Object.keys(services).filter(service => services[service]),
            CheckInDate: new Date().toISOString(),
            ModePaiement: formData.ModePaiement,
            Email: formData.email,
            Constat: formData.constat
        };

        try {
            const response = await fetch('https://localhost:7141/api/checkIn/CompleteCheckIn', {
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
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-visible">
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
                                    label: `${reservation.nom} ${reservation.prenom} - Room Type: ${reservation.id_Type_Chambre}`
                                }))}
                                onChange={handleReservationSelect}
                                placeholder="Select a reservation"
                                isSearchable={true}
                                isClearable={true}
                            />
                        </div>

                        {selectedReservation && (
                            <>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Reservation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Reservation ID</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Guest Name</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {`${selectedReservation.nom} ${selectedReservation.prenom}`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Check-in Date</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {new Date(selectedReservation.dateCheckIn).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Check-out Date</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                                {new Date(selectedReservation.dateCheckOut).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Room Type</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.id_Type_Chambre}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total Price</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">${selectedReservation.prixTotal}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Number of Adults</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.nombreAdults}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Number of Children</p>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.nombreEnfants}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Constat</p>
                                            <input
                                                type="text"
                                                name="constat"
                                                value={formData.constat}
                                                onChange={handleChange}
                                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Guest Information</h3>
                                    {guests.map((guest, index) => (
                                        <div key={index} className="mb-8 last:mb-0 p-4 border border-gray-200 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.nom}
                                                        onChange={(e) => handleGuestChange(index, 'nom', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={guest.prenom}
                                                        onChange={(e) => handleGuestChange(index, 'prenom', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                                                    <input
                                                        type="text"
                                                        value={guest.cin}
                                                        onChange={(e) => handleGuestChange(index, 'cin', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

                                <div className="payment-section bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        <i className="fas fa-credit-card me-2"></i>
                                        Mode de Paiement
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="payment-option">
                                            <input
                                                type="radio"
                                                id="carte"
                                                name="ModePaiement"
                                                value="carte"
                                                checked={formData.ModePaiement === 'carte'}
                                                onChange={handleChange}
                                                required
                                                className="mr-2"
                                            />
                                            <label htmlFor="carte">
                                                <i className="far fa-credit-card mr-2"></i>
                                                Carte Bancaire
                                            </label>
                                        </div>

                                        <div className="payment-option">
                                            <input
                                                type="radio"
                                                id="especes"
                                                name="ModePaiement"
                                                value="especes"
                                                checked={formData.ModePaiement === 'especes'}
                                                onChange={handleChange}
                                                required
                                                className="mr-2"
                                            />
                                            <label htmlFor="especes">
                                                <i className="fas fa-money-bill-wave mr-2"></i>
                                                Espèces
                                            </label>
                                        </div>

                                        <div className="payment-option">
                                            <input
                                                type="radio"
                                                id="cheque"
                                                name="ModePaiement"
                                                value="cheque"
                                                checked={formData.ModePaiement === 'cheque'}
                                                onChange={handleChange}
                                                required
                                                className="mr-2"
                                            />
                                            <label htmlFor="cheque">
                                                <i className="fas fa-money-check mr-2"></i>
                                                Chèque
                                            </label>
                                        </div>

                                        <div className="payment-option">
                                            <input
                                                type="radio"
                                                id="lien_paiement"
                                                name="ModePaiement"
                                                value="lien_paiement"
                                                checked={formData.ModePaiement === 'lien_paiement'}
                                                onChange={handleChange}
                                                required
                                                className="mr-2"
                                            />
                                            <label htmlFor="lien_paiement">
                                                <i className="fas fa-link mr-2"></i>
                                                Lien de Paiement
                                            </label>
                                        </div>
                                    </div>
                                    {formData.ModePaiement === 'lien_paiement' && (
                                        <div className="payment-link-section mt-4">
                                            <div className="flex gap-4">
                                                <input
                                                    type="email"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="Email du client"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    <i className="fas fa-paper-plane mr-2"></i>
                                                    Envoyer le lien
                                                </button>
                                            </div>
                                        </div>
                                    )}
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