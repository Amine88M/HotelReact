import './App.css';

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import ReceptionDashboard from './components/Reception/ReceptionDashboard'; // Exemple pour Receptionist
import PersonnelDeMenageUI from './components/PersonnelDeMenage/PersonnelDeMenageUI';
import Layout from './components/Receptionist/Layout';
import Reservations from './components/Receptionist/Reservations';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reception" element={<ReceptionDashboard />} />
        <Route path="/Receptionist" element={<Layout></Layout>} />
        <Route path="/Receptionist/reservations" element={<Layout><Reservations /></Layout>} />
        <Route path="/PersonnelDeMenage" element={<PersonnelDeMenageUI />} /> {/* Correct usage of Route with 'element' */}
      </Routes>
    </Router>
  );
}

export default App;


// In your routes:

