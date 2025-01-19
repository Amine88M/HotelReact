import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogIn, LogOut, Menu, BedDouble, UserCircle, X, Camera, Key, CalendarCheck ,Settings} from 'lucide-react';
import { Link,Outlet} from 'react-router-dom';
import Profile from '../Profile/Profile';


export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);

    if (userId) {
      fetchProfilePhoto(userId, token);
    }
  }, []);

  const fetchProfilePhoto = (userId, token) => {
    fetch(`https://localhost:7141/api/user/${userId}/photo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Erreur de chargement de la photo');
      return response.blob();
    })
    .then(blob => {
      setProfilePhoto(URL.createObjectURL(blob));
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Upload nouvelle photo
      const response = await fetch(`https://localhost:7141/api/user/${userId}/upload-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de l\'upload');

      // Recharger la photo
      fetchProfilePhoto(userId, token);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                  <span className="text-blue-600">Royal</span>
                  <span className="text-gray-900">Stay</span>
                  <span className="text-blue-600">.</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Receptionist/create-reservation" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Create a Reservation
              </Link>
              <Link to="/Receptionist/checkInModal" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Client Check-in
              </Link>
              <Link to="/Receptionist/checkOutModal" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Client Check-out
              </Link>
              <Link to="/Receptionist/today-reservations" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Today's Reservations
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100"
                >
                  {profilePhoto ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-md">
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <UserCircle size={48} className="text-gray-600" />
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <UserCircle size={16} />
                      Profile
                    </button>
                    
                    <button>
                      <Link to="/" className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={16} />
                        Déconnexion
                      </Link> 
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 lg:translate-x-0`}>
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/Receptionist/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/Receptionist/checkin" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <LogIn className="w-5 h-5 text-gray-500" />
                <span className="ml-3">Check-in</span>
              </Link>
            </li>
            <li>
              <Link to="/Receptionist/checkout" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <LogOut className="w-5 h-5 text-gray-500" />
                <span className="ml-3">Check-out</span>
              </Link>
            </li>
            <li>
              <Link to="/Receptionist/chambres" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <BedDouble className="w-5 h-5 text-gray-500" />
                <span className="ml-3">Rooms</span>
              </Link>
            </li>
            <li>
              <Link to="/Receptionist/reserver-services" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-500" /> 
                {/* Icône pour "Services" */}
                <span className="ml-3">Services</span>
              </Link>
            </li>

            
            <li>
              <Link to="/Receptionist/reservations" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <CalendarCheck className="w-5 h-5 text-gray-500" />
                <span className="ml-3">Reservations</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>


      {/* Main content area where sub-routes (like CheckIn, CheckOut) will render */}
      <div className={`p-4 ${isSidebarOpen ? 'lg:ml-64' : ''} pt-20`}>
        <Outlet />
      </div>
  

      
      <Profile 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      
    </div>
  );
}

