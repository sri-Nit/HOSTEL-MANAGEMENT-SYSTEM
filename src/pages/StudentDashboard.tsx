import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, UserCircle, HelpCircle, Clock, ArrowRight, FileText, Sparkles } from 'lucide-react';
import FeedbackForm from '@/components/dashboard/FeedbackForm';
import { Badge } from '@/components/ui/badge';
import BulletinBoard from '@/components/bulletin/BulletinBoard';

interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-[#fff2cf] text-[#9d6a00] border-[#f3d989]',
  approved: 'bg-[#e8f0ff] text-[#2f3c97] border-[#cad4ff]',
  in_progress: 'bg-[#fff1e6] text-[#b96315] border-[#ffd1ac]',
  resolved: 'bg-[#e8f8ee] text-[#2f8b52] border-[#bfe7ce]',
  rejected: 'bg-[#ffe9e9] text-[#c74a4a] border-[#f4b7b7]',
  escalated: 'bg-[#fdecec] text-[#b94a48] border-[#efb7b7]',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState([
    { label: 'Pending', value: '0', tone: 'bg-[#fff2cf] text-[#9d6a00] border-[#f3d989]' },
    { label: 'Resolved', value: '0', tone: 'bg-[#e8f8ee] text-[#2f8b52] border-[#bfe7ce]' },
    { label: 'Escalated', value: '0', tone: 'bg-[#fdecec] text-[#b94a48] border-[#efb7b7]' },
  ]);

  useEffect(() => {
    const savedComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(savedComplaints);

    setStats([
      {
        label: 'Pending',
        value: savedComplaints.filter((c: Complaint) => c.status === 'pending' || c.status === 'approved' || c.status === 'in_progress').length.toString(),
        tone: 'bg-[#fff2cf] text-[#9d6a00] border-[#f3d989]'
      },
      {
        label: 'Resolved',
        value: savedComplaints.filter((c: Complaint) => c.status === 'resolved').length.toString(),
        tone: 'bg-[#e8f8ee] text-[#2f8b52] border-[#bfe7ce]'
      },
      {
        label: 'Escalated',
        value: savedComplaints.filter((c: Complaint) => c.status === 'escalated').length.toString(),
        tone: 'bg-[#fdecec] text-[#b94a48] border-[#efb7b7]'
      },
    ]);
  }, []);

  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="campus-page flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
          <section className="campus-panel overflow-hidden">
            <div
              className="relative min-h-[220px] overflow-hidden px-6 py-8 sm:px-8"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(26,35,102,0.78), rgba(26,35,102,0.36)), url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="relative z-10 max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Hostel Management System
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">My Complaints Dashboard</h1>
                <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/82 sm:text-base">
                  Register new complaints, track updates, and stay informed about your hostel support requests in one place.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/student/submit-complaint">
                    <Button className="rounded-full bg-white px-5 text-[#252b63] hover:bg-white/90">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Lodge Complaint
                    </Button>
                  </Link>
                  <Link to="/student/my-complaints">
                    <Button variant="outline" className="rounded-full border-white/40 bg-white/10 px-5 text-white hover:bg-white/18">
                      <ListChecks className="mr-2 h-4 w-4" />
                      Complaint History
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`campus-stat animate-fade-up ${stat.tone}`} style={{ animationDelay: `${index * 80}ms` }}>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em]">{stat.label}</p>
                <div className="mt-3 text-center text-4xl font-extrabold">{stat.value}</div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6">
              <BulletinBoard />

              <Card className="campus-table-shell">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <CardTitle className="text-xl font-extrabold text-[#252b63]">Recent Complaint Activity</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">The latest updates on your requests.</p>
                  </div>
                  <Link to="/student/my-complaints">
                    <Button variant="ghost" size="sm" className="rounded-full text-[#2f3c97] hover:bg-[#eef1ff]">
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {recentComplaints.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                      <Clock className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                      <p className="font-semibold text-slate-500">No complaint activity yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-[#fafbff]">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#2f3c97]">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#252b63]">{complaint.category}</p>
                              <p className="text-sm text-slate-500">{complaint.description}</p>
                              <p className="mt-1 text-xs font-medium text-slate-400">
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${statusColors[complaint.status]}`}>
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
              <FeedbackForm />
              <Card className="campus-panel-soft overflow-hidden">
                <CardHeader className="border-b border-slate-100 px-6 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-[#252b63]">
                    <HelpCircle className="h-5 w-5 text-[#2f3c97]" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-6 py-5">
                  <Link to="/student/submit-complaint" className="block">
                    <Button className="h-12 w-full justify-between rounded-xl bg-[#2f3c97] text-white hover:bg-[#252b63]">
                      New Complaint
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/student/need-help" className="block">
                    <Button variant="outline" className="h-12 w-full justify-between rounded-xl border-[#dbe1ff] bg-white text-[#2f3c97] hover:bg-[#f8f9ff]">
                      Contact Support
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="ghost" className="h-12 w-full justify-between rounded-xl text-slate-600 hover:bg-[#f5f7ff] hover:text-[#2f3c97]">
                      Account Profile
                      <UserCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
