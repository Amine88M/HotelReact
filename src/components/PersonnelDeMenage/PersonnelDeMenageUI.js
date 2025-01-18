import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Camera, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
const API_BASE_URL = 'https://localhost:7141';

const PersonnelDeMenageUI = () => {
  const [rooms, setRooms] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = {
    name: "Wadie Saad",
    role: "Personnel de menage"
  };

  useEffect(() => {
    fetchDirtyRooms();
  }, []);

  const fetchDirtyRooms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chambre/dirty`);
        if (!response.ok) throw new Error('Failed to fetch dirty rooms');
        const data = await response.json();
        console.log(data); // Add this line to check the data
        setRooms(data);
    } catch (error) {
        console.error('Error fetching dirty rooms:', error);
    } finally {
        setLoading(false);
    }
};
  const handleStatusChange = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chambre/clean/${roomId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) throw new Error('Failed to update room status');
      
      // Remove the room from the list immediately after successful update
      setRooms(prevRooms => prevRooms.filter(room => room.numChambre !== roomId));
    } catch (error) {
      console.error('Error updating room status:', error);
    }
    setOpenDropdown(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 mr-auto">Royal<span className="text-black">Stay</span>.</h1>
          <div className="flex items-center space-x-2 relative">
            <span className="text-sm">{user.name}</span>
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <User size={32} className="text-gray-600" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {/* Handle profile picture change */}}
                  >
                    <Camera size={16} />
                    Change Profile Picture
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {/* Handle password change */}}
                  >
                    <Key size={16} />
                    Change Password
                  </button>
                  <Link to="/" >
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                  Déconnexion
                  </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800">Hello, {user.name}</h2>
        <p className="text-gray-500 mb-12">Have a nice day!</p>

        <h3 className="text-2xl font-medium text-gray-700 mb-6">List of Dirty Hotel Rooms</h3>
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.numChambre} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h4 className="font-medium text-gray-800">Room {room.numChambre}</h4>
                  <p className="text-gray-500 text-sm">Type: {room.typeName}</p>
                  {room.description && (
                  <p className="text-gray-500 text-sm">{room.description}</p>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === room.numChambre ? null : room.numChambre)}
                  className="px-6 py-2 rounded-lg flex items-center space-x-1 text-white bg-yellow-500"
                >
                  <span>Dirty</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === room.numChambre && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <button
                      onClick={() => handleStatusChange(room.numChambre)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mark as Clean
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PersonnelDeMenageUI;