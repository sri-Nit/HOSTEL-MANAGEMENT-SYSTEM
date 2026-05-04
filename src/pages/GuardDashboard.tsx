import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight, ShieldCheck, ClipboardList, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  location?: {
    block?: string;
    floor?: string;
    room?: string;
  };
}

const GuardDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingComplaints, setPendingComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    resolved: 0,
    escalated: 0
  });

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const pending = allComplaints.filter((c: Complaint) => c.status === 'pending');

    setPendingComplaints(pending.slice(0, 6));
    setStats({
      pending: pending.length,
      resolved: allComplaints.filter((c: Complaint) => c.status === 'resolved').length,
      escalated: allComplaints.filter((c: Complaint) => c.status === 'escalated').length
    });
  }, []);

  const statCards = [
    { label: 'Pending Tasks', value: stats.pending, tone: 'bg-[#fff2cf] text-[#9d6a00] border-[#f3d989]' },
    { label: 'Resolved Tasks', value: stats.resolved, tone: 'bg-[#e8f8ee] text-[#2f8b52] border-[#bfe7ce]' },
    { label: 'Escalated', value: stats.escalated, tone: 'bg-[#fdecec] text-[#b94a48] border-[#efb7b7]' },
  ];

  return (
    <div className="campus-page flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
          <section className="campus-panel-soft px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f3c97]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Warder Console
                </div>
                <h1 className="campus-section-title">Worker Dashboard</h1>
                <p className="mt-2 max-w-2xl campus-subtle">
                  View assigned complaints, verify new submissions, and move approved work through active resolution.
                </p>
              </div>
              <div className="rounded-2xl border border-[rgba(72,83,154,0.14)] bg-white px-5 py-4 text-sm shadow-[0_16px_30px_-24px_rgba(42,51,107,0.2)]">
                <p className="font-semibold text-slate-500">Signed in as</p>
                <p className="mt-1 text-lg font-extrabold text-[#252b63]">{user?.name}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {statCards.map((card, index) => (
              <div key={card.label} className={`campus-stat animate-fade-up ${card.tone}`} style={{ animationDelay: `${index * 80}ms` }}>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em]">{card.label}</p>
                <div className="mt-3 text-center text-4xl font-extrabold">{card.value}</div>
              </div>
            ))}
          </section>

          <Card className="campus-table-shell">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <CardTitle className="text-xl font-extrabold text-[#252b63]">Pending Review Queue</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Complaints awaiting verification or action.</p>
              </div>
              <Link to="/guard/complaints">
                <Button variant="ghost" size="sm" className="rounded-full text-[#2f3c97] hover:bg-[#eef1ff]">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {pendingComplaints.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <p className="font-semibold text-slate-500">No pending complaints to review.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingComplaints.map((complaint) => (
                    <div key={complaint._id} className="flex flex-col gap-4 px-6 py-5 transition-colors duration-200 hover:bg-[#fafbff] md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#2f3c97]">
                          <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#252b63]">{complaint.category}</p>
                          <p className="text-sm text-slate-500">{complaint.studentName}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              Block {complaint.location?.block || 'N/A'}, Floor {complaint.location?.floor || 'N/A'}
                              {complaint.location?.room ? `, Room ${complaint.location.room}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="rounded-full border border-[#f3d989] bg-[#fff2cf] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9d6a00]">
                          Pending
                        </Badge>
                        <Link to={`/guard/complaint/${complaint._id}`}>
                          <Button className="rounded-xl bg-[#2f3c97] px-5 text-white hover:bg-[#252b63]">Review</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GuardDashboard;
