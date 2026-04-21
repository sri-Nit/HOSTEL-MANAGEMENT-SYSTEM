import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, UserCircle, HelpCircle, Clock, ArrowRight, FileText, Activity } from 'lucide-react';
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
  approved: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  escalated: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Filed', value: '0', icon: FileText, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Active Issues', value: '0', icon: Activity, color: 'text-[#d9531e]', bg: 'bg-[#d9531e]/10' },
    { label: 'Resolved', value: '0', icon: ListChecks, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]);

  useEffect(() => {
    const savedComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(savedComplaints);

    const total = savedComplaints.length;
    const inProgress = savedComplaints.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'pending').length;
    const resolved = savedComplaints.filter((c: Complaint) => c.status === 'resolved').length;

    setStats([
      { label: 'Total Filed', value: total.toString(), icon: FileText, color: 'text-white', bg: 'bg-white/5' },
      { label: 'Active Issues', value: inProgress.toString(), icon: Activity, color: 'text-[#d9531e]', bg: 'bg-[#d9531e]/10' },
      { label: 'Resolved', value: resolved.toString(), icon: ListChecks, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ]);
  }, []);

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#020617]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Dashboard</h1>
              <p className="text-slate-400 font-medium">
                Welcome back, <span className="text-[#d9531e] font-bold">{user?.name}</span>.
              </p>
            </div>
            <Link to="/student/submit-complaint">
              <Button className="bg-[#d9531e] hover:bg-[#bf4618] text-white font-bold px-6 py-6 rounded-2xl shadow-xl shadow-[#d9531e]/20 transition-all hover:-translate-y-1 flex gap-2">
                <PlusCircle size={20} />
                New Complaint
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-[#0f172a] border-white/5 shadow-2xl rounded-3xl overflow-hidden group hover:border-white/10 transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} transition-transform group-hover:scale-110 duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BulletinBoard />
              
              <Card className="bg-[#0f172a] border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black text-white">Recent Activity</CardTitle>
                  <Link to="/student/my-complaints">
                    <Button variant="ghost" size="sm" className="text-[#d9531e] font-bold hover:bg-white/5 rounded-xl">
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {recentComplaints.length === 0 ? (
                      <div className="p-16 text-center">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="h-8 w-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-bold">No recent complaints found.</p>
                      </div>
                    ) : (
                      recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                              <FileText size={24} />
                            </div>
                            <div>
                              <p className="font-black text-white">{complaint.category}</p>
                              <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
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
              <Card className="bg-[#d9531e] text-white border-none rounded-3xl p-8 shadow-2xl shadow-[#d9531e]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HelpCircle size={120} />
                </div>
                <CardHeader className="p-0 mb-6 relative z-10">
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    Support Center
                  </CardTitle>
                  <p className="text-white/80 text-sm font-medium">Need assistance? We're here to help.</p>
                </CardHeader>
                <CardContent className="p-0 space-y-3 relative z-10">
                  <Link to="/student/need-help">
                    <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white border-none rounded-2xl h-14 font-bold transition-all">
                      Contact Staff
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-between text-white/60 hover:text-white hover:bg-white/5 rounded-2xl h-14 font-bold transition-all">
                      Account Settings
                      <UserCircle size={18} />
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