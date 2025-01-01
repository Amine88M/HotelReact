import React, { useState, useEffect } from 'react';
import { ChevronDown, User } from 'lucide-react';

const API_BASE_URL = 'https://localhost:7206'; // Replace with your .NET API port

const PersonnelDeMenageUI = () => {
  const [rooms, setRooms] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);

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
      
      // Update local state
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

  // Filter out clean rooms
  const visibleRooms = rooms.filter(room => room.status !== "Available");

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white shadow-sm p-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h1 className="text-primary">Royal<span className="text-dark">Stay</span>.</h1>
          </div>
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
              <User className="text-white" size={20} />
            </div>
            <span className="ms-2 text-muted">{user.name}</span>
            <ChevronDown className="ms-2 text-muted" size={16} />
          </div>
        </div>
      </header>

      <main className="container py-5">
        <div className="mb-4">
          <h2 className="h4 text-dark">Hello, {user.name}</h2>
          <p className="text-muted">Have a nice day</p>
        </div>

        <div>
          <h3 className="h5 text-dark mb-4">List of Hotel Rooms</h3>
          <div className="list-group">
            {visibleRooms.map(room => (
              <div key={room.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                <div>
                  <h5 className="mb-1">{room.number}</h5>
                  <p className="mb-0 text-muted">{room.floor}</p>
                </div>
                <div className="position-relative">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === room.id ? null : room.id)}
                    className={`btn ${room.status === 'Dirty' ? 'btn-primary' : room.status === 'Cleaning' ? 'btn-warning' : 'btn-success'} dropdown-toggle`}
                    data-bs-toggle="dropdown"
                  >
                    {room.status}
                  </button>
                  
                  {openDropdown === room.id && (
                    <ul className="dropdown-menu position-absolute end-0 mt-2">
                      <li><button onClick={() => handleStatusChange(room.id, "Dirty")} className="dropdown-item">Dirty</button></li>
                      <li><button onClick={() => handleStatusChange(room.id, "Cleaning")} className="dropdown-item">Cleaning</button></li>
                      <li><button onClick={() => handleStatusChange(room.id, "Clean")} className="dropdown-item">Clean</button></li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonnelDeMenageUI;
