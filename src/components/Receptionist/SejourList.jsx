import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Calendar, AlertCircle, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function SejourList() {
  const navigate = useNavigate();
  const [sejours, setSejours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCautionOptions, setShowCautionOptions] = useState(false);
  const [selectedCautionStatus, setSelectedCautionStatus] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const cautionStatuses = {
    Active: 'Active',
    PartiellementLibere: 'Partiellement Libéré',
    TotallementLibere: 'Totalement Libéré',
  };

  // Fetch Sejours from the API
  useEffect(() => {
    const fetchSejours = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/Sejour');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setSejours(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load sejours. Please try again later.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5',
        });
        setLoading(false);
      }
    };

    fetchSejours();
  }, []);

  // Filter Sejours based on search term and caution status
  const filteredSejours = sejours.filter((sejour) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      sejour.id_sejour.toString().includes(searchText) ||
      sejour.reservation_Id.toString().includes(searchText) ||
      sejour.numChambre.toString().includes(searchText);

    const matchesCautionStatus = selectedCautionStatus ? sejour.statut_Caution === selectedCautionStatus : true;

    return matchesSearch && matchesCautionStatus;
  });

  // Show temporary information message
  const showTemporaryMessage = (message) => {
    setInfoMessage(message);
    setTimeout(() => {
      setInfoMessage(null);
    }, 3000);
  };

  // Check if no Sejours match the criteria
  useEffect(() => {
    if (filteredSejours.length === 0 && (selectedCautionStatus || searchTerm)) {
      const cautionLabel = selectedCautionStatus ? cautionStatuses[selectedCautionStatus] : null;

      if (cautionLabel) {
        showTemporaryMessage(`No sejours with caution status "${cautionLabel}".`);
      } else if (searchTerm) {
        showTemporaryMessage(`No sejours match the search term "${searchTerm}".`);
      }
    }
  }, [filteredSejours, selectedCautionStatus, searchTerm]);

  // Handle row checkbox change
  const handleRowCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  // Handle delete selected Sejours
  const handleDeleteSelected = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the selected sejours!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('https://localhost:7141/api/Sejour/deleteselected', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedIds),
          });

          if (response.ok) {
            setSejours((prevSejours) =>
              prevSejours.filter((sejour) => !selectedIds.includes(sejour.id_sejour))
            );
            setSelectedIds([]);
            Swal.fire('Deleted!', 'The selected sejours have been deleted.', 'success');
          } else {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error!', error.message || 'An error occurred while deleting.', 'error');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">List of Sejours</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by ID, reservation ID, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <button
              onClick={() => setShowCautionOptions(!showCautionOptions)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedCautionStatus ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              } rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Filter by Caution Status
            </button>
            {showCautionOptions && (
              <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {Object.entries(cautionStatuses).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedCautionStatus(key);
                      setShowCautionOptions(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              selectedIds.length === 0
                ? 'bg-red-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 mr-2 ${
                selectedIds.length === 0 ? 'text-gray-400' : 'text-white'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Delete Selected
          </button>
        </div>
      </div>

      {/* Temporary info message */}
      {infoMessage && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Number of results */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredSejours.length} sejour(s) found
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-700">Loading...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="w-12 px-3 py-3 text-left"></th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sejour ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-11 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSejours.map((sejour) => (
                <tr key={sejour.id_sejour} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(sejour.id_sejour)}
                      onChange={() => handleRowCheckboxChange(sejour.id_sejour)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-9 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sejour.id_sejour}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sejour.reservation_Id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sejour.numChambre}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sejour.date_Checkin)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sejour.date_Checkout)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sejour.montant_Total_Sejour.toFixed(2)} €
                  </td>
                  
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/sejour/details/${sejour.id_sejour}`)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium mr-2"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}