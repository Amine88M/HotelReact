import React, { useState, useEffect } from 'react';
import { Search, Filter, ClipboardList, Trash2 } from 'lucide-react';

export default function CheckIn({ onNewCheckIn }) {
  const [checkIns, setCheckIns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]); // State to store room types

  // Fetch data from the SejourController, GuestInfoController, and RoomTypes API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sejour data
        const sejourResponse = await fetch('https://localhost:7141/api/Sejour');
        const sejours = await sejourResponse.json();
  
        // Fetch GuestInfo data
        const guestInfoResponse = await fetch('https://localhost:7141/api/GuestInfo');
        const guestInfos = await guestInfoResponse.json();
  
        // Map Sejour data to include guest name, CIN, number of persons, and room type
        const mappedData = await Promise.all(sejours.map(async (sejour) => {
          // Find the primary guest (assuming the first guest is the primary)
          const primaryGuest = guestInfos.find(guest => guest.id_sejour === sejour.id_sejour);
  
          // Fetch the number of persons from the reservation
          const nombrePersonnesResponse = await fetch(`https://localhost:7141/api/reservations/nombre-personnes/${sejour.reservation_Id}`);
          const nombrePersonnesData = await nombrePersonnesResponse.json();
          const numberOfPersons = nombrePersonnesData.nombrePersonnes;
  
          // Fetch the reservation details to get the id_Type_Chambre
          let roomType = 'N/A';
          const reservationResponse = await fetch(`https://localhost:7141/api/reservations/${sejour.reservation_Id}`);
          if (reservationResponse.ok) {
            const reservationData = await reservationResponse.json();
  
            // Fetch the room type name using the id_Type_Chambre from the reservation
            if (reservationData.id_Type_Chambre) {
              const roomTypeResponse = await fetch(`https://localhost:7141/api/reservations/room-type/${reservationData.id_Type_Chambre}`);
              if (roomTypeResponse.ok) {
                const roomTypeData = await roomTypeResponse.json();
                roomType = roomTypeData.text; // Use the room type name (nom_type_chambre)
              }
            }
          }
  
          return {
            id: sejour.id_sejour,
            guestName: primaryGuest ? `${primaryGuest.nom} ${primaryGuest.prenom}` : 'N/A',
            cin: primaryGuest?.cin || 'N/A',
            numberOfPersons,
            checkInDate: new Date(sejour.date_Checkin).toLocaleDateString(),
            roomNumber: sejour.numChambre,
            roomType, // Use the room type name fetched from the API
          };
        }));
  
        setCheckIns(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const filteredCheckIns = checkIns.filter((checkIn) => {
    const searchText = searchTerm.toLowerCase();
    return (
      checkIn.guestName.toLowerCase().includes(searchText) ||
      checkIn.cin.toLowerCase().includes(searchText) ||
      checkIn.roomNumber.toString().includes(searchText)
    );
  });

  const handleDeleteSelected = () => {
    setCheckIns(prevCheckIns => 
      prevCheckIns.filter(checkIn => !selectedIds.includes(checkIn.id))
    );
    setSelectedIds([]);
  };

  const handleRowSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Guest Check-ins</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <ClipboardList size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">
              Total Checkins: {checkIns.length}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} />
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by guest name, CIN, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setSortBy(prev => prev === 'date' ? null : 'date')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter size={20} />
          Sort by Date
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === checkIns.length}
                  onChange={() => 
                    setSelectedIds(prev => 
                      prev.length === checkIns.length ? [] : checkIns.map(c => c.id)
                    )
                  }
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persons</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCheckIns.map((checkIn) => (
              <tr key={checkIn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(checkIn.id)}
                    onChange={() => handleRowSelect(checkIn.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{checkIn.guestName}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.cin}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.numberOfPersons}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.roomNumber}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.roomType}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.checkInDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}