import React, { useState, useEffect, useRef } from 'react';

export default function CheckOutModal({ isOpen, onClose }) {
    const [roomNumber, setRoomNumber] = useState('');
    const modalRef = useRef();

    const handleCheckOut = (e) => {
        e.preventDefault();
        console.log('Checking out room:', roomNumber);
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
                <h3 className="text-lg font-medium text-gray-900 text-center">Check-out</h3>
                <form onSubmit={handleCheckOut} className="mt-2">
                    <input
                        className="mt-2 p-2 w-full border rounded-md"
                        type="text"
                        placeholder="Room Number"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        required
                    />
                    <div className="items-center px-4 py-3">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-700"
                            type="submit"
                        >
                            Check Out
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
