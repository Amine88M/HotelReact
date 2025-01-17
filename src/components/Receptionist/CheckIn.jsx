import React, { useState } from 'react';
import { Search, Filter, UserPlus, Trash2 } from 'lucide-react';


export default function CheckIn({ onNewCheckIn }) {
  const [checkIns, setCheckIns] = useState([
    { id: 1, guestName: 'John Doe', numberOfPersons: 2, cin: 'AB123456', rooms: ['101', '102'], services: ['Breakfast', 'WiFi'], checkInDate: '2023-06-15', status: 'Pending' },
    { id: 2, guestName: 'Jane Smith', numberOfPersons: 1, cin: 'CD789012', rooms: ['201'], services: ['Room Service'], checkInDate: '2023-06-16', status: 'Completed' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState(null);


  const filteredCheckIns = checkIns.filter((checkIn) => {
    const searchText = searchTerm.toLowerCase();
    return (
      checkIn.guestName.toLowerCase().includes(searchText) ||
      checkIn.cin.toLowerCase().includes(searchText) ||
      checkIn.rooms.some(room => room.toLowerCase().includes(searchText))
    );
  });

  const handleNewCheckIn = () => {
    if (onNewCheckIn) {
      onNewCheckIn();
    }
  };

  const handleDeleteSelected = () => {
    setCheckIns(prevCheckIns => 
      prevCheckIns.filter(checkIn => !selectedIds.includes(checkIn.id))
    );
    setSelectedIds([]);
  };

  const handleCompleteCheckIn = (id) => {
    setCheckIns(prevCheckIns =>
      prevCheckIns.map(checkIn =>
        checkIn.id === id ? { ...checkIn, status: 'Completed' } : checkIn
      )
    );
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
            <Receipt size={20} className="text-gray-500" />
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persons</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.numberOfPersons}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.cin}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-1">
                    {checkIn.rooms.map(room => (
                      <span key={room} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">{room}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-1 flex-wrap">
                    {checkIn.services.map(service => (
                      <span key={service} className="px-2 py-1 bg-green-100 text-green-800 rounded-md">{service}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkIn.checkInDate}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    checkIn.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {checkIn.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleCompleteCheckIn(checkIn.id)}
                    disabled={checkIn.status === 'Completed'}
                    className="text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}