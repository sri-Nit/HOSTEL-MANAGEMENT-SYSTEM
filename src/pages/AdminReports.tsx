import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Complaint {
  _id: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#3b82f6',
  approved: '#10b981',
  in_progress: '#f59e0b',
  resolved: '#059669',
  rejected: '#ef4444',
  escalated: '#f97316',
};

const AdminReports: React.FC = () => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [resolutionStats, setResolutionStats] = useState({
    avgTime: '2.4 Days',
    efficiency: '92%',
    totalResolved: 0
  });

  useEffect(() => {
    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    
    const categories: Record<string, number> = {};
    allComplaints.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })));

    const statuses: Record<string, number> = {};
    allComplaints.forEach(c => {
      statuses[c.status] = (statuses[c.status] || 0) + 1;
    });
    setStatusData(Object.entries(statuses).map(([name, value]) => ({ name, value })));

    const resolved = allComplaints.filter(c => c.status === 'resolved');
    setResolutionStats(prev => ({
      ...prev,
      totalResolved: resolved.length
    }));
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              System Analytics & Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visual insights into complaint trends, staff performance, and resolution metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AVG. RESOLUTION TIME</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolutionStats.avgTime}</div>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> 12% faster than last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">RESOLUTION RATE</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolutionStats.efficiency}</div>
                <p className="text-xs text-muted-foreground mt-1">Based on {resolutionStats.totalResolved} resolved issues</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ESCALATION RATE</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2%</div>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  +0.5% increase this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complaints by Category</CardTitle>
                <CardDescription>Volume of issues reported per department</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Distribution</CardTitle>
                <CardDescription>Current state of all system complaints</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Complaint Volume</CardTitle>
                <CardDescription>Comparison of reported vs resolved issues over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 'Mon', reported: 12, resolved: 10 },
                    { day: 'Tue', reported: 19, resolved: 15 },
                    { day: 'Wed', reported: 15, resolved: 18 },
                    { day: 'Thu', reported: 22, resolved: 20 },
                    { day: 'Fri', reported: 30, resolved: 25 },
                    { day: 'Sat', reported: 10, resolved: 12 },
                    { day: 'Sun', reported: 8, resolved: 9 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reported" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;