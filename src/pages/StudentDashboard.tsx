import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, UserCircle, HelpCircle, Clock, ArrowRight, FileText } from 'lucide-react';
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
  pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  escalated: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Complaints', value: '0', color: 'text-white', bg: 'bg-[#1e293b]' },
    { label: 'Active Issues', value: '0', color: 'text-[#d9531e]', bg: 'bg-[#d9531e]/10' },
    { label: 'Resolved', value: '0', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]);

  useEffect(() => {
    const savedComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(savedComplaints);

    const total = savedComplaints.length;
    const inProgress = savedComplaints.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'pending').length;
    const resolved = savedComplaints.filter((c: Complaint) => c.status === 'resolved').length;

    setStats([
      { label: 'Total Complaints', value: total.toString(), color: 'text-white', bg: 'bg-[#1e293b]' },
      { label: 'Active Issues', value: inProgress.toString(), color: 'text-[#d9531e]', bg: 'bg-[#d9531e]/10' },
      { label: 'Resolved', value: resolved.toString(), color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ]);
  }, []);

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-[#f8fafc]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-2">Student Dashboard</h1>
            <p className="text-lg text-slate-500 font-medium">
              Welcome back, <span className="text-[#d9531e] font-bold">{user?.name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} transition-transform group-hover:scale-110 duration-300`}>
                    <ListChecks className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BulletinBoard />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link to="/student/submit-complaint" className="group">
                  <Button className="w-full h-32 text-xl font-black flex flex-col gap-3 bg-[#0f172a] hover:bg-[#1e293b] rounded-3xl shadow-2xl shadow-slate-900/20 transition-all duration-300 group-hover:-translate-y-1">
                    <PlusCircle size={32} className="text-[#d9531e]" />
                    New Complaint
                  </Button>
                </Link>
                <Link to="/student/my-complaints" className="group">
                  <Button variant="outline" className="w-full h-32 text-xl font-black flex flex-col gap-3 border-2 border-slate-200 hover:border-[#d9531e] hover:bg-white rounded-3xl transition-all duration-300 group-hover:-translate-y-1">
                    <ListChecks size={32} className="text-slate-400 group-hover:text-[#d9531e]" />
                    Track Issues
                  </Button>
                </Link>
              </div>

              <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black text-[#0f172a]">Recent Activity</CardTitle>
                  <Link to="/student/my-complaints">
                    <Button variant="ghost" size="sm" className="text-[#d9531e] font-bold hover:bg-orange-50">
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {recentComplaints.length === 0 ? (
                      <div className="p-12 text-center">
                        <Clock className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No recent complaints found.</p>
                      </div>
                    ) : (
                      recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                              <FileText size={24} />
                            </div>
                            <div>
                              <p className="font-black text-[#0f172a]">{complaint.category}</p>
                              <p className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${statusColors[complaint.status]} border font-black px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider`}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <FeedbackForm />
              <Card className="bg-[#0f172a] text-white border-none rounded-3xl p-6 shadow-2xl shadow-slate-900/30">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <HelpCircle className="text-[#d9531e]" />
                    Support Center
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <Link to="/student/need-help">
                    <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-12 font-bold">
                      Contact Staff
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-between text-white/60 hover:text-white hover:bg-white/5 rounded-xl h-12 font-bold">
                      Account Settings
                      <UserCircle size={16} />
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