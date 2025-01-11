import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Camera, Key } from 'lucide-react';

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
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/housekeeping`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update room status');
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      console.error('Error updating room status:', error);
    }
    setOpenDropdown(null);
  };

  const visibleRooms = rooms.filter(room => room.status !== "Clean");

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
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800">Hello, {user.name}</h2>
        <p className="text-gray-500 mb-12">Have a nice day!</p>

        <h3 className="text-2xl font-medium text-gray-700 mb-6">List of Hotel Rooms</h3>
        <div className="space-y-4">
          {visibleRooms.map(room => (
            <div key={room.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h4 className="font-medium text-gray-800">{room.number}</h4>
                <p className="text-gray-500 text-sm">{room.floor}</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === room.id ? null : room.id)}
                  className={`px-6 py-2 rounded-lg flex items-center space-x-1 text-white ${room.status === 'Dirty' ? 'bg-blue-500' : room.status === 'Cleaning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                >
                  <span>{room.status}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === room.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <button
                      onClick={() => handleStatusChange(room.id, "Dirty")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dirty
                    </button>
                    <button
                      onClick={() => handleStatusChange(room.id, "Cleaning")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cleaning
                    </button>
                    <button
                      onClick={() => handleStatusChange(room.id, "Clean")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Clean
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
