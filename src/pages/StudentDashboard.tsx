import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import ComplaintList from '@/components/complaints/ComplaintList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}. Manage your hostel complaints here.
            </p>
          </div>

          <Tabs defaultValue="my-complaints" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
              <TabsTrigger value="submit-new">Submit New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-complaints" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
                  <ComplaintList />
                </div>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border shadow-sm">
                    <h3 className="font-semibold mb-2">Quick Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Submitted</span>
                        <span className="font-bold">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>In Progress</span>
                        <span className="font-bold text-yellow-600">1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Resolved</span>
                        <span className="font-bold text-green-600">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="submit-new">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
                <ComplaintForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default StudentDashboard;