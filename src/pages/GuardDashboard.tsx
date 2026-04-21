import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const GuardDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    resolvedToday: 0,
    active: 0
  });

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const pending = allComplaints.filter((c: Complaint) => c.status === 'pending');
    const active = allComplaints.filter((c: Complaint) => c.status === 'approved' || c.status === 'in_progress');
    
    setPendingComplaints(pending.slice(0, 5));
    setStats({
      pending: pending.length,
      active: active.length,
      resolvedToday: allComplaints.filter((c: Complaint) => c.status === 'resolved').length
    });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Warden Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome, {user?.name}. You have {stats.pending} complaints awaiting verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.active}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Resolved Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.resolvedToday}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Pending Complaints
              </CardTitle>
              <Link to="/guard/complaints">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingComplaints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-20" />
                    <p>No pending complaints to review.</p>
                  </div>
                ) : (
                  pendingComplaints.map((complaint) => (
                    <div key={complaint._id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col">
                        <span className="font-semibold">{complaint.category}</span>
                        <span className="text-xs text-muted-foreground">
                          From: {complaint.studentName} • {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link to={`/guard/complaint/${complaint._id}`}>
                        <Button size="sm" variant="outline">Verify</Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GuardDashboard;