import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReceptionDashboard from './components/Reception/ReceptionDashboard';
import ReservationForm from './components/ReservationForm/ReservationForm';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateUserPage from './components/Admin/CreateUser';
import PersonnelDeMenageUI from './components/PersonnelDeMenage/PersonnelDeMenageUI';
import Layout from './components/Receptionist/Layout';
import Reservations from './components/Receptionist/Reservations';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUserPage />} />
        <Route path="/reception" element={<ReceptionDashboard />} />
        <Route path="/reservations/create" element={<ReservationForm />} />
        <Route path="/Receptionist" element={<Layout />} />
        <Route path="/Receptionist/reservations" element={<Layout> <Reservations/></Layout>} />
        <Route path="/PersonnelDeMenage" element={<PersonnelDeMenageUI />} />
        <Route path="/reservations/create-form" element={<Layout> <ReservationForm /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;