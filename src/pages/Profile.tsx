import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Building, DoorOpen, ShieldCheck } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Profile</h1>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-8">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <p className="text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Account Role</p>
                    <p className="font-medium capitalize">{user?.role}</p>
                  </div>
                </div>

                {user?.role === 'student' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                        <Building size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Hostel Block</p>
                        <p className="font-medium">{user?.hostelBlock || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                        <DoorOpen size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Room Number</p>
                        <p className="font-medium">{user?.roomNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;