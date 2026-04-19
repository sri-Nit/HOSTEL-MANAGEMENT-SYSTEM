import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, UserCircle, HelpCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Complaints', value: '2', color: 'text-blue-600' },
    { label: 'In Progress', value: '1', color: 'text-yellow-600' },
    { label: 'Resolved', value: '0', color: 'text-green-600' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Student Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}. Here's an overview of your hostel complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/student/submit-complaint">
                  <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                    <PlusCircle size={24} />
                    Submit New Complaint
                  </Button>
                </Link>
                <Link to="/student/my-complaints">
                  <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                    <ListChecks size={24} />
                    View My Complaints
                  </Button>
                </Link>
                <Link to="/student/need-help">
                  <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                    <HelpCircle size={24} />
                    Need Help?
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                    <UserCircle size={24} />
                    Manage Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                    <p className="font-medium">Complaint #1234 Updated</p>
                    <p className="text-xs text-muted-foreground">Status changed to In Progress</p>
                  </div>
                  <div className="text-sm border-l-2 border-green-500 pl-3 py-1">
                    <p className="font-medium">New Message Received</p>
                    <p className="text-xs text-muted-foreground">From: Warden</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default StudentDashboard;