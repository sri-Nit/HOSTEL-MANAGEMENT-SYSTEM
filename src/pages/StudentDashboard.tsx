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
  pending: 'bg-blue-50 text-blue-600 border-blue-100',
  approved: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  in_progress: 'bg-amber-50 text-amber-600 border-amber-100',
  resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-600 border-rose-100',
  escalated: 'bg-orange-50 text-orange-600 border-orange-100',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Filed', value: '0', icon: FileText, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Active Issues', value: '0', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved', value: '0', icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]);

  useEffect(() => {
    const savedComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    setComplaints(savedComplaints);

    const total = savedComplaints.length;
    const inProgress = savedComplaints.filter((c: Complaint) => c.status === 'in_progress' || c.status === 'pending').length;
    const resolved = savedComplaints.filter((c: Complaint) => c.status === 'resolved').length;

    setStats([
      { label: 'Total Filed', value: total.toString(), icon: FileText, color: 'text-slate-900', bg: 'bg-slate-100' },
      { label: 'Active Issues', value: inProgress.toString(), icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Resolved', value: resolved.toString(), icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ]);
  }, []);

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f8fafc]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h1>
              <p className="text-slate-500 font-medium">
                Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>. Here's your overview.
              </p>
            </div>
            <Link to="/student/submit-complaint">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-6 rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 flex gap-2">
                <PlusCircle size={20} />
                New Complaint
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
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
              
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-50 p-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black text-slate-900">Recent Activity</CardTitle>
                  <Link to="/student/my-complaints">
                    <Button variant="ghost" size="sm" className="text-slate-900 font-bold hover:bg-slate-50 rounded-xl">
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {recentComplaints.length === 0 ? (
                      <div className="p-16 text-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="h-8 w-8 text-slate-200" />
                        </div>
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
                              <p className="font-black text-slate-900">{complaint.category}</p>
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
              <Card className="bg-slate-900 text-white border-none rounded-3xl p-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <HelpCircle size={120} />
                </div>
                <CardHeader className="p-0 mb-6 relative z-10">
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    Support Center
                  </CardTitle>
                  <p className="text-slate-400 text-sm font-medium">Need assistance? We're here to help.</p>
                </CardHeader>
                <CardContent className="p-0 space-y-3 relative z-10">
                  <Link to="/student/need-help">
                    <Button className="w-full justify-between bg-white/10 hover:bg-white/20 text-white border-none rounded-2xl h-14 font-bold transition-all">
                      Contact Staff
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl h-14 font-bold transition-all">
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