import React from 'react';
import TodayReservations from './TodayReservations';
export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Guests</h3>
        <p className="text-2xl font-bold text-gray-900">45</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Available Rooms</h3>
        <p className="text-2xl font-bold text-gray-900">23</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Check-ins</h3>
        <p className="text-2xl font-bold text-gray-900">8</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Check-outs</h3>
        <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="col-span-full">
        <TodayReservations />
      </div>
        
      </div>
      
      
  );
}

