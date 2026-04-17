import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Welcome, {user?.name}! Here you have full control over the system.
          </p>
          {/* Admin-specific content will go here */}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default AdminDashboard;