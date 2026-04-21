import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '@/utils/toast';
import { useAuth } from '@/context/AuthContext';
import { 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  MessageSquare,
  ImageIcon
} from 'lucide-react';

interface Complaint {
  _id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  image?: string;
  location: {
    block: string;
    floor: string;
    room: string;
  };
  rejectionReason?: string;
}

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const found = allComplaints.find((c: Complaint) => c._id === id);
    if (found) {
      setComplaint(found);
    }
  }, [id]);

  const updateStatus = (newStatus: string, reason?: string) => {
    const allComplaints = JSON.parse(localStorage.getItem('user_complaints') || '[]');
    const updated = allComplaints.map((c: Complaint) => {
      if (c._id === id) {
        return { ...c, status: newStatus, rejectionReason: reason || c.rejectionReason };
      }
      return c;
    });
    localStorage.setItem('user_complaints', JSON.stringify(updated));
    showSuccess(`Complaint ${newStatus} successfully!`);
    
    if (user?.role === 'guard') navigate('/guard/complaints');
    else if (user?.role === 'admin') navigate('/admin/all-complaints');
  };

  if (!complaint) return <div className="p-8 text-center">Loading complaint details...</div>;

  const isGuard = user?.role === 'guard';
  const isAdmin = user?.role === 'admin';
  const canAction = (isGuard || isAdmin) && complaint.status === 'pending';

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2">{complaint.category}</Badge>
                      <CardTitle className="text-2xl">Complaint Details</CardTitle>
                      <CardDescription>ID: #{complaint._id.slice(-6)}</CardDescription>
                    </div>
                    <Badge variant={complaint.status === 'pending' ? 'outline' : 'secondary'} className="capitalize">
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.image && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Evidence Photo
                      </h4>
                      <div className="rounded-lg overflow-hidden border bg-black/5 max-h-[400px] flex justify-center">
                        <img 
                          src={complaint.image} 
                          alt="Issue Evidence" 
                          className="max-w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {complaint.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <h4 className="text-sm font-semibold text-red-700 mb-1">Rejection Reason</h4>
                      <p className="text-sm text-red-600">{complaint.rejectionReason}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted By</p>
                        <p className="font-medium text-sm">{complaint.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-full text-green-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date Submitted</p>
                        <p className="font-medium text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {canAction && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Actions</CardTitle>
                    <CardDescription>Approve this complaint to assign it to a worker or reject it with a reason.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!showRejectInput ? (
                      <div className="flex gap-4">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus('approved')}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Assign
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setShowRejectInput(true)}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Enter reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            className="flex-1"
                            disabled={!rejectionReason}
                            onClick={() => updateStatus('rejected', rejectionReason)}
                          >
                            Confirm Rejection
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => setShowRejectInput(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hostel Block</span>
                    <span className="font-bold">{complaint.location?.block || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Floor</span>
                    <span className="font-bold">{complaint.location?.floor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room Number</span>
                    <span className="font-bold">{complaint.location?.room || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Quick Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">Send a quick message to the student regarding this issue.</p>
                  <Button variant="secondary" className="w-full">Open Chat</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;