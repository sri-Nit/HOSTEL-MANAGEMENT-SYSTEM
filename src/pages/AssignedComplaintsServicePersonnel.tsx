import React from 'react';
import Sidebar from '@/components/Sidebar';

const AssignedComplaintsServicePersonnel: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Assigned Complaints (Service Personnel)</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Service personnel can view and update their assigned complaints here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AssignedComplaintsServicePersonnel;