import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importez Bootstrap CSS

function ReservationListPage() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Hotel Azure</h1>
      <h2 className="text-center mb-4">Liste des Reservations</h2>

      <div className="row mb-4">
        <div className="col">
          <button className="btn btn-primary me-2">Operations</button>
          <button className="btn btn-secondary me-2">Aplacier une Reservation</button>
          <button className="btn btn-warning me-2">Exemption Et Attention</button>
          <button className="btn btn-info">Reservations du Jour</button>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>NOM</th>
            <th>PRENOM</th>
            <th>DATE DE RESERVATION</th>
            <th>DATE D'ARRIVEE</th>
            <th>DATE DE DEPART</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>El Amrani</td>
            <td>Mohamed</td>
            <td>01/01/2024</td>
            <td>05/01/2024</td>
            <td>10/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Rouazza</td>
            <td>Falima</td>
            <td>02/01/2024</td>
            <td>06/01/2024</td>
            <td>11/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Perjefloun</td>
            <td>Yasirine</td>
            <td>03/01/2024</td>
            <td>07/01/2024</td>
            <td>12/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Amina</td>
            <td>Taxi</td>
            <td>04/01/2024</td>
            <td>08/01/2024</td>
            <td>13/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>El Fassi</td>
            <td>Omar</td>
            <td>05/01/2024</td>
            <td>09/01/2024</td>
            <td>14/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Chabr</td>
            <td>Salma</td>
            <td>06/01/2024</td>
            <td>10/01/2024</td>
            <td>15/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Haiji</td>
            <td>Khalid</td>
            <td>07/01/2024</td>
            <td>11/01/2024</td>
            <td>16/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Rhani</td>
            <td>Hajar</td>
            <td>08/01/2024</td>
            <td>12/01/2024</td>
            <td>17/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Bennis</td>
            <td>Nabil</td>
            <td>09/01/2024</td>
            <td>13/01/2024</td>
            <td>18/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Ouazzari</td>
            <td>Asma</td>
            <td>10/01/2024</td>
            <td>14/01/2024</td>
            <td>19/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
          <tr>
            <td>Jabri</td>
            <td>Reda</td>
            <td>11/01/2024</td>
            <td>15/01/2024</td>
            <td>20/01/2024</td>
            <td>
              <button className="btn btn-success btn-sm me-2">Check-in</button>
              <button className="btn btn-danger btn-sm">Check-out</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ReservationListPage;