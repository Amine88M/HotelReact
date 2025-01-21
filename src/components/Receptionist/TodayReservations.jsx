import React, { useEffect, useState } from 'react';
import './TodayReservations.css';
import Swal from 'sweetalert2';

export default function TodayReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://localhost:7141/api/reservations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des réservations');
        }
        const data = await response.json();

        const today = new Date().toISOString().split('T')[0];
        const todayCheckInReservations = data.filter(reservation => {
          const checkInDate = reservation.dateCheckIn.split('T')[0];
          return checkInDate === today;
        });

        // Tri alphabétique par nom
        const sortedReservations = todayCheckInReservations.sort((a, b) => {
          // Tri d'abord par nom
          const compareNom = a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
          // Si les noms sont identiques, trier par prénom
          if (compareNom === 0) {
            return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
          }
          return compareNom;
        });

        setReservations(sortedReservations);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Réservations du Jour - ${new Date().toLocaleDateString('fr-FR')}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3498db;
            }
            .logo {
              font-size: 24px;
              color: #3498db;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              color: #2c3e50;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏨 RoyalStay</div>
            <h1>Réservations du ${new Date().toLocaleDateString('fr-FR')}</h1>
          </div>

          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(reservation => `
                <tr>
                  <td>${reservation.nom} ${reservation.prenom}</td>
                  <td>${reservation.statut}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="today-reservations-container">
      <div className="header-section">
        <h2 className="title">
          <i className="fas fa-calendar-day"></i>
          Réservations du Jour
        </h2>
        <div className="actions">
          <button 
            className="print-button"
            onClick={handlePrint}
          >
            <i className="fas fa-print"></i>
            Imprimer
          </button>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div className="stat-info">
            <span className="stat-value">{reservations.length}</span>
            <span className="stat-label">Réservations</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Adultes</th>
              <th>Enfants</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="guest-name">
                  <i className="fas fa-user"></i>
                  {reservation.nom} {reservation.prenom}
                </td>
                <td>
                  <i className="fas fa-male"></i> {reservation.nombreAdults}
                </td>
                <td>
                  <i className="fas fa-child"></i> {reservation.nombreEnfants}
                </td>
                <td>
                  <span className={`status-badge ${reservation.statut.toLowerCase()}`}>
                    {reservation.statut}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-button view"
                    onClick={() => {
                      Swal.fire({
                        title: 'Détails de la réservation',
                        html: `
                          <div class="reservation-details">
                            <p><strong>Client:</strong> ${reservation.nom} ${reservation.prenom}</p>
                            <p><strong>Check-in:</strong> ${new Date(reservation.dateCheckIn).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> ${new Date(reservation.dateCheckOut).toLocaleDateString()}</p>
                            <p><strong>Adultes:</strong> ${reservation.nombreAdults}</p>
                            <p><strong>Enfants:</strong> ${reservation.nombreEnfants}</p>
                            <p><strong>Statut:</strong> ${reservation.statut}</p>
                          </div>
                        `,
                        icon: 'info',
                        confirmButtonColor: '#3498db'
                      });
                    }}
                  >
                    <i className="fas fa-eye"></i>
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