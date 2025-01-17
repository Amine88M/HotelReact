import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReservationForm from './components/ReservationForm/ReservationForm';
import Login from './components/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateUserPage from './components/Admin/CreateUser';
import EditUser from './components/Admin/EditUser';
import PersonnelDeMenageUI from './components/PersonnelDeMenage/PersonnelDeMenageUI';
import Layout from './components/Receptionist/Layout';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import Chambre from './components/Chambres/Chambre';
import Reservations from './components/Receptionist/Reservations';
import TodayReservations from './components/Receptionist/TodayReservations';
import Dashboard from './components/Receptionist/Dashboard';
import CheckIn from './components/Receptionist/CheckIn';
import CheckOut from './components/Receptionist/CheckOut';
import ProtectedRoute from './components/ProtectedRoute';
import CreateChambre from './components/Chambres/CreateChambre';

import './App.css';

function App() {
  const isAuthenticated = true; // Replace with your actual authentication logic
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="roles" element={<div>Page des rôles</div>} />
          <Route path="reset-password" element={<div>Page de réinitialisation</div>} />
        </Route>
        
        <Route path="/PersonnelDeMenage" element={<PersonnelDeMenageUI />} />
        
        {/* Protected Receptionist Routes */}
        <Route 
          path="/Receptionist/*" 
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Layout />}
            />
          }
        >
          {/* Nested Routes for Receptionist */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="today-reservations" element={<TodayReservations />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="create-reservation" element={<ReservationForm />} />
<<<<<<< HEAD
          <Route path="chambres" element={ <Chambre />} />
          <Route path="create-chambre" element={<CreateChambre />} />
=======
          <Route path="chambres" element={<Chambre />} />
>>>>>>> 5df7b754d286daaa0c1dd052849ea24c06d433b7
        </Route>
      </Routes>
    </Router>
  );
}

export default App;