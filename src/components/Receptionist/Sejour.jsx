import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import SejourDisplay from './SejourDisplay';

const SejourPage = ({ sejourId }) => {
  const [sejour, setSejour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSejourData();
  }, [sejourId]);

  const fetchSejourData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7141/api/Sejour/${sejourId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setSejour(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCautionStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`https://localhost:7141/api/Sejour/${sejourId}/caution-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStatus),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      // Refresh the sejour data
      fetchSejourData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddGuest = async (guestInfo) => {
    try {
      const response = await fetch(`https://localhost:7141/api/Sejour/${sejourId}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestInfo),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      // Refresh the sejour data
      fetchSejourData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 my-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-600">Erreur</h3>
        </div>
        <p className="mt-2 text-sm text-red-600">
          Une erreur s'est produite lors du chargement des données : {error}
        </p>
      </div>
    );
  }

  if (!sejour) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 my-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-600">Information</h3>
        </div>
        <p className="mt-2 text-sm text-blue-600">
          Aucun séjour trouvé avec cet identifiant.
        </p>
      </div>
    );
  }

  return (
    <SejourDisplay
      sejour={sejour}
      onCautionStatusUpdate={handleCautionStatusUpdate}
      onAddGuest={handleAddGuest}
    />
  );
};

export default SejourPage;