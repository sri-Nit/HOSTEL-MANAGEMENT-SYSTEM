import React from 'react';
import Sidebar from '@/components/Sidebar';
import { MadeWithDyad } from '@/components/made-with-dyad';
import ComplaintForm from '@/components/complaints/ComplaintForm';

const SubmitComplaint: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Submit New Complaint</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please provide details about the issue you're experiencing in your hostel.
          </p>
          <ComplaintForm />
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default SubmitComplaint;