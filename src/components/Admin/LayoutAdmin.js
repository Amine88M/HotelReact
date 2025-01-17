import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import { MdDashboard, MdPersonAdd, MdPeople, MdSecurity, MdPassword, MdLogout } from 'react-icons/md';

function LayoutAdmin() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Bouton pour toggle le menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
      >
        {isOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Menu latéral avec animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-[#1e3a8a] text-white fixed h-full shadow-lg"
          >
            <div className="p-4 pt-16">
              <h2 className="text-2xl font-semibold mb-6 px-4">Admin Panel</h2>
              
              <nav className="space-y-2">
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
                >
                  <MdDashboard className="mr-3 text-2xl text-blue-400 group-hover:text-white" />
                  <span className="group-hover:text-white">Dashboard</span>
                </Link>

                <Link 
                  to="/admin/create-user" 
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
                >
                  <MdPersonAdd className="mr-3 text-2xl text-green-400 group-hover:text-white" />
                  <span className="group-hover:text-white">Créer un Compte</span>
                </Link>
                
                <Link 
                  to="/admin/users" 
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
                >
                  <MdPeople className="mr-3 text-2xl text-yellow-400 group-hover:text-white" />
                  <span className="group-hover:text-white">Liste des Utilisateurs</span>
                </Link>
                
                <Link 
                  to="/admin/roles" 
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
                >
                  <MdSecurity className="mr-3 text-2xl text-purple-400 group-hover:text-white" />
                  <span className="group-hover:text-white">Attribuer Rôles</span>
                </Link>
                
                <Link 
                  to="/admin/reset-password" 
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
                >
                  <MdPassword className="mr-3 text-2xl text-orange-400 group-hover:text-white" />
                  <span className="group-hover:text-white">Réinitialiser Mot de Passe</span>
                </Link>
              </nav>
            </div>

            <div className="absolute bottom-0 w-64 p-4 bg-[#1e3a8a] border-t border-[#1e40af]">
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#1e40af] rounded-lg transition-colors group"
              >
                <MdLogout className="mr-3 text-2xl text-red-500 group-hover:text-red-400" />
                <span className="group-hover:text-red-400">Déconnexion</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal avec animation */}
      <motion.div
        animate={{ marginLeft: isOpen ? '16rem' : '0' }}
        transition={{ duration: 0.3 }}
        className="flex-1 bg-gray-100 min-h-screen"
      >
        <div className="p-8 pt-16">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

export default LayoutAdmin; 