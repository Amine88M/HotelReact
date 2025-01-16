import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ReservationForm from './components/ReservationForm/ReservationForm';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateUserPage from './components/Admin/CreateUser';
import PersonnelDeMenageUI from './components/PersonnelDeMenage/PersonnelDeMenageUI';
import Layout from './components/Receptionist/Layout';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import Chambre from './components/Chambres/Chambre';
import Reservations from './components/Receptionist/Reservations';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="roles" element={<div>Page des rôles</div>} />
          <Route path="reset-password" element={<div>Page de réinitialisation</div>} />
        </Route>
        <Route path="/Receptionist" element={<Layout />} />

        <Route path="/PersonnelDeMenage" element={<PersonnelDeMenageUI />} />
        <Route path="/reservations/create-form" element={<Layout><ReservationForm /></Layout>} />
        <Route path="/Receptionist/reservations" element={<Layout> <Reservations/></Layout>} />
        <Route path="/chambres" element={<Layout> <Chambre /></Layout>} />
        <Route path="/PersonnelDeMenage" element={<PersonnelDeMenageUI />} />
        <Route path="/reservations/create-form" element={<Layout> <ReservationForm /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;