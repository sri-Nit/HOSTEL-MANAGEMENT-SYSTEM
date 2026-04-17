import React from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';

const ManageComplaintsWarden: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Manage Complaints (Warden)</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Wardens can approve, reject, and assign complaints here.
          </p>
          {/* List of complaints for warden to manage will go here */}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default ManageComplaintsWarden;