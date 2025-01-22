import React, { useState, useEffect } from 'react';
import Sejour from './Sejour';
import { Calendar, AlertCircle, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Filters Component
const Filters = ({ filters, handleFilterChange, handleSearch }) => (
  <div className="mb-6 space-y-4">
    {/* Search Bar */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>

    {/* Filters */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Date Range Filter */}
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
      />
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
      />

      {/* Status Filter */}
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleFilterChange('cautionStatus', e.target.value)}
      >
        <option value="">Tous les statuts</option>
        <option value="Active">Active</option>
        <option value="PartiellementLibere">Partiellement Libéré</option>
        <option value="TotallementLibere">Totalement Libéré</option>
      </select>

      {/* Room Number Filter */}
      <input
        type="number"
        placeholder="Numéro de chambre"
        className="w-full p-2 border rounded-lg"
        onChange={(e) => handleFilterChange('chambreNum', e.target.value)}
      />
    </div>
  </div>
);

// Sorting Headers Component
const SortingHeaders = ({ handleSort, sortField, sortDirection }) => (
  <div className="mb-4 grid grid-cols-3 gap-4">
    <button onClick={() => handleSort('id_sejour')} className="flex items-center text-gray-600 hover:text-gray-900">
      ID Séjour <ChevronDown className="h-4 w-4 ml-1" />
    </button>
    <button onClick={() => handleSort('date_Checkin')} className="flex items-center text-gray-600 hover:text-gray-900">
      Date Check-in <ChevronDown className="h-4 w-4 ml-1" />
    </button>
    <button onClick={() => handleSort('montant_Total_Sejour')} className="flex items-center text-gray-600 hover:text-gray-900">
      Montant Total <ChevronDown className="h-4 w-4 ml-1" />
    </button>
  </div>
);

// Sejour Item Component
const SejourItem = ({ sejour, selectedSejour, setSelectedSejour }) => (
  <div
    key={sejour.id_sejour}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    onClick={() => setSelectedSejour(selectedSejour === sejour.id_sejour ? null : sejour.id_sejour)}
  >
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold mb-2">Séjour #{sejour.id_sejour}</h2>
        <p className="text-gray-600">Réservation #{sejour.reservation_Id}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-blue-600">{sejour.montant_Total_Sejour.toFixed(2)} €</p>
        <p className="text-sm text-gray-500">Chambre {sejour.numChambre}</p>
      </div>
    </div>

    <div className="mt-4 flex items-center space-x-6 text-gray-600">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Check-in: {formatDate(sejour.date_Checkin)}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Check-out: {formatDate(sejour.date_Checkout)}</span>
      </div>
    </div>

    <div className="mt-4">
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm ${
          sejour.statut_Caution === 'Active'
            ? 'bg-yellow-100 text-yellow-800'
            : sejour.statut_Caution === 'PartiellementLibere'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {sejour.statut_Caution}
      </span>
    </div>

    {selectedSejour === sejour.id_sejour && (
      <div className="mt-6 border-t pt-4">
        <Sejour {...sejour} />
      </div>
    )}
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, setCurrentPage, itemsPerPage, setItemsPerPage }) => (
  <div className="mt-6 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <select
        className="border rounded p-2"
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value="5">5 par page</option>
        <option value="10">10 par page</option>
        <option value="20">20 par page</option>
      </select>
      <span className="text-gray-600">Page {currentPage} sur {totalPages}</span>
    </div>

    <div className="flex space-x-2">
      <button
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);

// Main SejourList Component
const SejourList = () => {
  const [sejours, setSejours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSejour, setSelectedSejour] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting state
  const [sortField, setSortField] = useState('id_sejour');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filtering state
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    cautionStatus: '',
    chambreNum: '',
    searchQuery: '',
  });

  useEffect(() => {
    fetchSejours();
  }, []);

  const fetchSejours = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7141/api/Sejour');
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setSejours(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter functions
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Search function
  const handleSearch = (query) => {
    handleFilterChange('searchQuery', query);
  };

  // Apply all filters and sorting to data
  const getFilteredAndSortedData = () => {
    let filteredData = [...sejours];

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        (sejour) =>
          sejour.id_sejour.toString().includes(query) ||
          sejour.reservation_Id.toString().includes(query) ||
          sejour.numChambre.toString().includes(query)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filteredData = filteredData.filter((sejour) => {
        const checkIn = new Date(sejour.date_Checkin);
        const checkOut = new Date(sejour.date_Checkout);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return checkIn >= startDate && checkOut <= endDate;
      });
    }

    // Apply caution status filter
    if (filters.cautionStatus) {
      filteredData = filteredData.filter((sejour) => sejour.statut_Caution === filters.cautionStatus);
    }

    // Apply room number filter
    if (filters.chambreNum) {
      filteredData = filteredData.filter((sejour) => sejour.numChambre.toString() === filters.chambreNum);
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
    });

    return filteredData;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const filteredAndSortedData = getFilteredAndSortedData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      data: filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(filteredAndSortedData.length / itemsPerPage),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Une erreur s'est produite lors du chargement des données : {error}</p>
        </div>
      </div>
    );
  }

  const { data: paginatedSejours, totalPages } = getPaginatedData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Liste des Séjours</h1>

      <Filters filters={filters} handleFilterChange={handleFilterChange} handleSearch={handleSearch} />
      <SortingHeaders handleSort={handleSort} sortField={sortField} sortDirection={sortDirection} />

      {/* Sejours List */}
      <div className="grid grid-cols-1 gap-6">
        {paginatedSejours.map((sejour) => (
          <SejourItem
            key={sejour.id_sejour}
            sejour={sejour}
            selectedSejour={selectedSejour}
            setSelectedSejour={setSelectedSejour}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default SejourList;