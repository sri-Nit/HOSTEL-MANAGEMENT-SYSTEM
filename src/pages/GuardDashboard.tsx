import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const GuardDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Guard Dashboard</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Welcome, {user?.name}! You are logged in as a Security Guard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Complaints awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Patrols</CardTitle>
                <ShieldCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Ongoing security checks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Issues closed in last 24h</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default GuardDashboard;