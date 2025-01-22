import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Details from './components/Receptionist/Details';
import ChambreList from "./ChambreListe";
import SejourList from "./components/Receptionist/SejourList";
import SejourDisplay from "./components/Receptionist/SejourDisplay";
import Sejour from "./components/Receptionist/Sejour";
import CreateChambre from './components/Chambres/CreateChambre';
import CheckInModal from './components/Receptionist/CheckInModal';
import CheckOutModal from './components/Receptionist/CheckOutModal';
import ReserverServices from './components/InterfaceService/ReserverServices';
import CreateService from './components/InterfaceService/CreateService';
import ReservationPage from './components/InterfaceService/ReservationPage';
import ConsulterService from './components/InterfaceService/ConsulterService';
import './App.css';
import AdminDashboardUI from './components/Admin/AdminDashboardUi';

// Composant Unauthorized directement dans App.js
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">403 - Accès Refusé</h1>
        <p className="mt-4 text-gray-700">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    </div>
  );
};

// Composant ProtectedRoute directement dans App.js
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur
  const isAuthenticated = !!localStorage.getItem('userId'); // Vérifier si l'utilisateur est connecté

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />; // Rediriger vers une page d'erreur si l'utilisateur n'a pas le bon rôle
  }

  return children; // Autoriser l'accès si l'utilisateur a le bon rôle
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/" element={<Login />} />

        {/* Page d'erreur 403 */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Routes protégées pour l'administrateur */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboardUI />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="consulter-services" element={<ConsulterService />} />
          <Route path="create-chambre" element={<CreateChambre />} />
          <Route path="create-service" element={<CreateService />} />
          <Route path="roles" element={<div>Page des rôles</div>} />
          <Route path="reset-password" element={<div>Page de réinitialisation</div>} />
        </Route>

        {/* Routes protégées pour le réceptionniste */}
        <Route
          path="/receptionist/*"
          element={
            <ProtectedRoute allowedRoles={['Receptionist']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="today-reservations" element={<TodayReservations />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="create-reservation" element={<ReservationForm />} />
          <Route path="chambres" element={<Chambre />} />
          <Route path="reserver-services" element={<ReserverServices />} />
          <Route path="details/:id" element={<Details />} />
          <Route path="reserver-services/reservation" element={<ReservationPage />} />
          <Route path="chambres-disponibles" element={<ChambreList />} />
          <Route path="SejourList" element={<SejourList />} />
          <Route path="SejourDisplay" element={<SejourDisplay />} />
          <Route path="checkInModal" element={<CheckInModal />} />
          <Route path="checkOutModal" element={<CheckOutModal />} />


        </Route>

        {/* Routes protégées pour le personnel de ménage */}
        <Route
          path="/PersonnelDeMenage"
          element={
            <ProtectedRoute allowedRoles={['Personnel De Menage']}>
              <PersonnelDeMenageUI />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;