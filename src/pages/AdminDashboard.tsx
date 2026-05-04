import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  Megaphone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminBulletinForm from '@/components/bulletin/AdminBulletinForm';
import { clearAllData } from '@/services/auth';
import { showSuccess } from '@/utils/toast';

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  const loadData = () => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');

    setStats({
      total: allComplaints.length,
      pending: allComplaints.filter((c: Complaint) => c.status === 'pending').length,
      inProgress: allComplaints.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'approved').length,
      resolved: allComplaints.filter((c: Complaint) => c.status === 'resolved').length,
      escalated: allComplaints.filter((c: Complaint) => c.status === 'escalated').length,
    });
    setRecentComplaints(allComplaints.slice(0, 6));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all system data? This will reset users and complaints.')) {
      clearAllData();
      showSuccess('System data cleared successfully.');
      loadData();
      window.location.reload();
    }
  };

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: ClipboardList, tone: 'bg-[#eef1ff] text-[#2f3c97] border-[#cad4ff]' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, tone: 'bg-[#fff2cf] text-[#9d6a00] border-[#f3d989]' },
    { title: 'In Progress', value: stats.inProgress, icon: TrendingUp, tone: 'bg-[#fff1e6] text-[#b96315] border-[#ffd1ac]' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, tone: 'bg-[#e8f8ee] text-[#2f8b52] border-[#bfe7ce]' },
    { title: 'Escalated', value: stats.escalated, icon: ShieldAlert, tone: 'bg-[#fdecec] text-[#b94a48] border-[#efb7b7]' },
  ];

  return (
    <div className="campus-page flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
          <section className="campus-panel-soft px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f3c97]">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Administrative Control
                </div>
                <h1 className="campus-section-title">Admin Dashboard</h1>
                <p className="mt-2 max-w-3xl campus-subtle">
                  Monitor system activity, review complaint throughput, manage announcements, and oversee escalations from a single command view.
                </p>
              </div>
              <Button variant="outline" onClick={handleReset} className="rounded-full border-[#efb7b7] bg-white px-5 text-[#b94a48] hover:bg-[#fff4f4]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset System Data
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card, index) => (
              <div key={card.title} className={`campus-stat animate-fade-up ${card.tone}`} style={{ animationDelay: `${index * 70}ms` }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em]">{card.title}</p>
                  <card.icon className="h-4 w-4" />
                </div>
                <div className="mt-4 text-center text-4xl font-extrabold">{card.value}</div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6">
              <AdminBulletinForm />

              <Card className="campus-table-shell">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-[#252b63]">
                    <AlertTriangle className="h-5 w-5 text-[#2f3c97]" />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {recentComplaints.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                      <Megaphone className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                      <p className="font-semibold text-slate-500">No complaints recorded in the system yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-[#fafbff]">
                          <div>
                            <p className="font-bold text-[#252b63]">{complaint.category}</p>
                            <p className="mt-1 text-sm text-slate-500">{complaint.description}</p>
                            <p className="mt-2 text-xs font-medium text-slate-400">
                              #{complaint._id.slice(-6)} • {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="rounded-full border border-[#cad4ff] bg-[#eef1ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2f3c97]">
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="campus-panel-soft">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="text-lg font-extrabold text-[#252b63]">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Database Connection</span>
                    <Badge className="rounded-full bg-[#e8f8ee] px-3 py-1 text-[#2f8b52] hover:bg-[#e8f8ee]">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Notification Service</span>
                    <Badge className="rounded-full bg-[#e8f8ee] px-3 py-1 text-[#2f8b52] hover:bg-[#e8f8ee]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Escalation Engine</span>
                    <Badge className="rounded-full bg-[#eef1ff] px-3 py-1 text-[#2f3c97] hover:bg-[#eef1ff]">Running</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-2xl border border-[#cad4ff] bg-[#2f3c97] text-white shadow-[0_18px_40px_-24px_rgba(42,51,107,0.45)]">
                <CardHeader className="px-6 py-5">
                  <CardTitle className="text-lg font-extrabold">Admin Guidance</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 text-sm leading-6 text-white/85">
                  Complaints that stay unresolved beyond the configured escalation threshold are automatically promoted for administrative review, keeping repeated and high-friction issues visible.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
