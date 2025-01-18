import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/Receptionist/dashboard">Dashboard</Link></li>
        <li><Link to="/Receptionist/checkin">Check-in</Link></li>
        <li><Link to="/Receptionist/checkout">Check-out</Link></li>
        <li><Link to="/Receptionist/reservations">Réservations</Link></li>
        <li><Link to="/Receptionist/chambres">Chambres</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 