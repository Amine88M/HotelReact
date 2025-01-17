import React, { useState } from 'react';
import { Search, Filter, Receipt, CreditCard, Printer } from 'lucide-react';

export default function CheckOut() {
  const [checkOuts, setCheckOuts] = useState([
    { 
      id: 1, 
      guestName: 'Alice Johnson', 
      numberOfPersons: 2, 
      cin: 'EF345678', 
      checkOutDate: '2023-06-17',
      roomCharges: 450,
      serviceCharges: 75,
      totalAmount: 525,
      paymentStatus: 'Pending',
      room: '301'
    },
    { 
      id: 2, 
      guestName: 'Bob Williams', 
      numberOfPersons: 1, 
      cin: 'GH901234', 
      checkOutDate: '2023-06-18',
      roomCharges: 300,
      serviceCharges: 50,
      totalAmount: 350,
      paymentStatus: 'Paid',
      room: '205'
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
 

  const filteredCheckOuts = checkOuts.filter((checkOut) => {
    const searchText = searchTerm.toLowerCase();
    return (
      checkOut.guestName.toLowerCase().includes(searchText) ||
      checkOut.cin.toLowerCase().includes(searchText) ||
      checkOut.room.toLowerCase().includes(searchText)
    );
  });

  const sortedCheckOuts = [...filteredCheckOuts].sort((a, b) => {
    if (sortBy === 'amount') {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const handlePayment = (id) => {
    setCheckOuts(prevCheckOuts =>
      prevCheckOuts.map(checkOut =>
        checkOut.id === id ? { ...checkOut, paymentStatus: 'Paid' } : checkOut
      )
    );
  };

  const handlePrintInvoice = (id) => {
    console.log(`Printing invoice for checkout ${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Guest Check-outs</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <Receipt size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">
              Total Checkouts: {checkOuts.length}
            </span>
          </div>
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
          onClick={() => setSortBy(prev => prev === 'amount' ? null : 'amount')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            sortBy === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter size={20} />
          Sort by Amount
        </button>
      </div>



      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Charges</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Charges</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCheckOuts.map((checkOut) => (
              <tr key={checkOut.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{checkOut.guestName}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkOut.room}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkOut.checkOutDate}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${checkOut.roomCharges.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${checkOut.serviceCharges.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${checkOut.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    checkOut.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {checkOut.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayment(checkOut.id)}
                      disabled={checkOut.paymentStatus === 'Paid'}
                      className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-1 rounded-md transition-colors"
                    >
                      <CreditCard size={16} />
                      Pay
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(checkOut.id)}
                      className="flex items-center gap-1 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                    >
                      <Printer size={16} />
                      Facture
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}