import React from 'react';
import Sidebar from '@/components/Sidebar';
import ComplaintList from '@/components/complaints/ComplaintList';

const MyComplaints: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Complaints</h1>
          <ComplaintList />
        </div>
      </main>
    </div>
  );
};

export default MyComplaints;