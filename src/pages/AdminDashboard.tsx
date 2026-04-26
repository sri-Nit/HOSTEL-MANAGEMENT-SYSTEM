import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  Loader2,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminBulletinForm from '@/components/bulletin/AdminBulletinForm';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: allComplaints, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (allComplaints) {
        const newStats = {
          total: allComplaints.length,
          pending: allComplaints.filter((c: any) => c.status === 'pending').length,
          inProgress: allComplaints.filter((c: any) => c.status === 'in_progress' || c.status === 'approved').length,
          resolved: allComplaints.filter((c: any) => c.status === 'resolved').length,
          escalated: allComplaints.filter((c: any) => c.status === 'escalated').length,
        };

        setStats(newStats);
        setRecentComplaints(allComplaints.slice(0, 5) as any);
      }
    } catch (error: any) {
      showError("Failed to load system stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWipeData = async () => {
    if (!currentUser) return;
    
    const confirm = window.confirm("DANGER: This will delete ALL complaints and ALL other user profiles. This cannot be undone. Continue?");
    if (!confirm) return;

    try {
      setLoading(true);
      
      // Delete all complaints
      const { error: compError } = await supabase.from('complaints').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (compError) throw compError;

      // Delete all profiles except current user
      const { error: profError } = await supabase.from('profiles').delete().neq('id', currentUser._id);
      if (profError) throw profError;

      showSuccess("System data wiped successfully. Note: Auth accounts must be deleted via Supabase SQL Editor.");
      loadData();
    } catch (error: any) {
      showError("Failed to wipe data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Escalated', value: stats.escalated, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Control Panel</h1>
              <p className="text-gray-600 dark:text-gray-400">
                System-wide overview of all hostel maintenance and security issues.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Button variant="destructive" onClick={handleWipeData} disabled={loading}>
                <Trash2 className="mr-2 h-4 w-4" /> Wipe System Data
              </Button>
            </div>
          </div>

          {loading && stats.total === 0 ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => (
                  <Card key={card.title} className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <div className={`p-2 rounded-full ${card.bg}`}>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <AdminBulletinForm />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        Recent System Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentComplaints.length === 0 ? (
                          <p className="text-center py-8 text-muted-foreground">No complaints recorded in the system yet.</p>
                        ) : (
                          recentComplaints.map((complaint) => (
                            <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{complaint.category}</span>
                                <span className="text-xs text-muted-foreground">
                                  ID: #{complaint.id.slice(-6)} • {new Date(complaint.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <Badge variant={complaint.status === 'escalated' ? 'destructive' : 'secondary'} className="capitalize">
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Database Connection</span>
                        <Badge className="bg-green-500">Healthy (Supabase)</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Notification Service</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Escalation Engine</span>
                        <Badge className="bg-green-500">Running</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="text-lg">Admin Tip</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm opacity-90">
                        To fully remove user accounts from the authentication system, you must run the SQL command in your Supabase dashboard.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;