import React, { useState } from 'react';
import {
  Users, Hotel, CalendarDays, DollarSign,
  Percent, BedDouble, ArrowUp, ArrowDown
} from 'lucide-react';

const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const StatCard = ({ title, value, change, icon: Icon }) => (
  <Card className="hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        {change && (
          <span className={`flex items-center ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-4 mt-6">
    {['Nouvelle Réservation', 'Check-in', 'Check-out', 'Gestion Chambres'].map((action) => (
      <button 
        key={action} 
        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-lg transition-colors"
      >
        {action}
      </button>
    ))}
  </div>
);

const AdminDashboard = () => {
  const [stats] = useState({
    occupancy: { value: '85%', change: 5 },
    rooms: { value: '15/50', change: -2 },
    bookings: { value: '127', change: 12 },
    revenue: { value: '€24,500', change: 8 },
    checkIns: { value: '12', change: 0 },
    avgStay: { value: '3.2 nuits', change: 3 }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-gray-500 mt-2">Aperçu de l'activité de l'hôtel</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Taux d'occupation"
            value={stats.occupancy.value}
            change={stats.occupancy.change}
            icon={Percent}
          />
          <StatCard 
            title="Chambres disponibles"
            value={stats.rooms.value}
            change={stats.rooms.change}
            icon={BedDouble}
          />
          <StatCard 
            title="Réservations"
            value={stats.bookings.value}
            change={stats.bookings.change}
            icon={CalendarDays}
          />
          <StatCard 
            title="Revenus"
            value={stats.revenue.value}
            change={stats.revenue.change}
            icon={DollarSign}
          />
          <StatCard 
            title="Arrivées du jour"
            value={stats.checkIns.value}
            change={stats.checkIns.change}
            icon={Users}
          />
          <StatCard 
            title="Durée moyenne séjour"
            value={stats.avgStay.value}
            change={stats.avgStay.change}
            icon={Hotel}
          />
        </div>

        <QuickActions />
      </div>
    </div>
  );
};

export default AdminDashboard;