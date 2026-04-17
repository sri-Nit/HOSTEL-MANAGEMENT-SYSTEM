import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Complaint Details</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Details for complaint ID: <span className="font-mono">{id}</span>
          </p>
          {/* Detailed complaint view will go here */}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default ComplaintDetail;