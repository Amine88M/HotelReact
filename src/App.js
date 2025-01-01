import logo from './logo.svg';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reception" element={<ReceptionDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


