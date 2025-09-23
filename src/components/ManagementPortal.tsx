import React from 'react';
import UnifiedManagementDashboard from './UnifiedManagementDashboard';

const ManagementPortal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Management Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage bookings, view calendar, and track business metrics</p>
        </div>
        
        <UnifiedManagementDashboard />
      </div>
    </div>
  );
};

export default ManagementPortal;