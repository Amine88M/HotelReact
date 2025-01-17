import React, { useState, useEffect, useRef } from 'react';

export default function CheckInModal({ isOpen, onClose }) {
    const [guestName, setGuestName] = useState('');
    const [numberOfPersons, setNumberOfPersons] = useState('');
    const [cin, setCin] = useState('');
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState({
        breakfast: false,
        wifi: false,
        parking: false,
        roomService: false,
        laundry: false,
        spa: false,
    });
    const modalRef = useRef();

    const handleCheckIn = (e) => {
        e.preventDefault();
        console.log('Checking in:', { guestName, numberOfPersons, cin, rooms, services });
        onClose();
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center h-full w-full">
            <div ref={modalRef} className="p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 text-center">Check-in</h3>
                <form onSubmit={handleCheckIn} className="mt-2 text-left">
                    <input
                        className="mt-2 p-2 w-full border rounded-md"
                        type="text"
                        placeholder="Guest Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                    />
                    <input
                        className="mt-2 p-2 w-full border rounded-md"
                        type="number"
                        placeholder="Number of Persons"
                        value={numberOfPersons}
                        onChange={(e) => setNumberOfPersons(e.target.value)}
                        required
                    />
                    <input
                        className="mt-2 p-2 w-full border rounded-md"
                        type="text"
                        placeholder="CIN"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        required
                    />
                    <select
                        className="mt-2 p-2 w-full border rounded-md"
                        multiple
                        value={rooms}
                        onChange={(e) => setRooms(Array.from(e.target.selectedOptions, option => option.value))}
                        required
                    >
                        <option value="101">Room 101</option>
                        <option value="102">Room 102</option>
                        <option value="201">Room 201</option>
                        <option value="202">Room 202</option>
                    </select>
                    <div className="mt-2">
                        <h4 className="font-medium">Services</h4>
                        {Object.entries(services).map(([service, checked]) => (
                            <div key={service} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={service}
                                    checked={checked}
                                    onChange={(e) => setServices(prev => ({ ...prev, [service]: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={service} className="ml-2 block text-sm text-gray-900">
                                    {service.charAt(0).toUpperCase() + service.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-700"
                            type="submit"
                        >
                            Check In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
