import React from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';

const AdminReports: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Reports</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            This page will show various system reports and statistics.
          </p>
          {/* Reports and charts will go here */}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default AdminReports;