import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
//import './components/ReservationForm/ReservationForm.css';

function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/reservations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        const data = await response.json();
        setReservations(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de charger les réservations. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#F8B1A5'
        });
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Rediriger vers la page de création de réservation
  const handleCreateReservation = () => {
    navigate('/Receptionist/reservations/create');
  };

  // Rediriger vers la page de détails d'une réservation
  const handleViewReservationDetails = (id) => {
    navigate(`/Receptionist/reservations/${id}`);
  };

  // Annuler une réservation
  const handleCancelReservation = async (id) => {
    try {
      const response = await fetch(`https://localhost:7141/api/reservations/annulerreservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(id)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      // Mettre à jour la liste des réservations après l'annulation
      setReservations(reservations.filter(reservation => reservation.id !== id));

      Swal.fire({
        title: 'Succès!',
        text: 'La réservation a été annulée avec succès.',
        icon: 'success',
        confirmButtonColor: '#8CD4B9'
      });
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible d\'annuler la réservation. Veuillez réessayer plus tard.',
        icon: 'error',
        confirmButtonColor: '#F8B1A5'
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Tableau de Bord du Réceptionniste</h2>

      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn"
          style={{ backgroundColor: '#8CD4B9', color: 'white' }}
          onClick={handleCreateReservation}
        >
          Créer une Réservation
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom du Client</th>
                <th>Type de Chambre</th>
                <th>Date d'Arrivée</th>
                <th>Date de Départ</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.nomClient}</td>
                  <td>{reservation.typeChambre}</td>
                  <td>{new Date(reservation.dateCheckIn).toLocaleDateString()}</td>
                  <td>{new Date(reservation.dateCheckOut).toLocaleDateString()}</td>
                  <td>{reservation.statut}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleViewReservationDetails(reservation.id)}
                    >
                      Détails
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Annuler
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

export default ReceptionistDashboard;