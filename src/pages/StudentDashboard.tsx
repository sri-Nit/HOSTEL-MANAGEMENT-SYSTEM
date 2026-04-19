import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, UserCircle, HelpCircle, Clock } from 'lucide-react';
import FeedbackForm from '@/components/dashboard/FeedbackForm';
import { Badge } from '@/components/ui/badge';

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
  escalated: 'bg-orange-100 text-orange-800',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Complaints', value: '0', color: 'text-blue-600' },
    { label: 'In Progress', value: '0', color: 'text-yellow-600' },
    { label: 'Resolved', value: '0', color: 'text-green-600' },
  ]);

  useEffect(() => {
    const savedComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(savedComplaints);

    const total = savedComplaints.length;
    const inProgress = savedComplaints.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'pending').length;
    const resolved = savedComplaints.filter((c: Complaint) => c.status === 'resolved').length;

    setStats([
      { label: 'Total Complaints', value: total.toString(), color: 'text-blue-600' },
      { label: 'Active Issues', value: inProgress.toString(), color: 'text-yellow-600' },
      { label: 'Resolved', value: resolved.toString(), color: 'text-green-600' },
    ]);
  }, []);

  const recentComplaints = complaints.slice(0, 3);

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Complaints</CardTitle>
                  <Link to="/student/my-complaints" className="text-sm text-blue-600 hover:underline">
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentComplaints.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent complaints.</p>
                    ) : (
                      recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-900">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{complaint.category}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Badge className={statusColors[complaint.status]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <FeedbackForm />
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Need Assistance?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/student/need-help">
                    <Button variant="secondary" className="w-full justify-start gap-2">
                      <HelpCircle size={16} />
                      Contact Support
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <UserCircle size={16} />
                      Profile Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default StudentDashboard;