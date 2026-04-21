import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { register, login } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Building2, Mail, Lock, User, MapPin, DoorOpen } from 'lucide-react';

const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'guard'>('student');
  const [hostelBlock, setHostelBlock] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: authContextLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userData;
      if (isRegister) {
        const registerData: any = { name, email, password, role };
        if (role === 'student') {
          registerData.hostelBlock = hostelBlock;
          registerData.roomNumber = roomNumber;
        }
        userData = await register(registerData);
        showSuccess('Registration successful! Please log in.');
        setIsRegister(false);
      } else {
        userData = await login({ email, password });
        authContextLogin(userData);
        showSuccess('Login successful!');
        navigate('/');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Full-screen Background Image with adjusted contrast/brightness for realism */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop")',
          filter: 'contrast(1.1) brightness(0.7)'
        }}
      />
      
      {/* Dark Gradient Overlay - slightly more subtle to let the real photo show through */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/60 via-black/30 to-primary/20 backdrop-blur-[1px]" />

      {/* Auth Card with Glassmorphism */}
      <Card className="relative z-20 w-full max-w-md border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <CardHeader className="space-y-2 pb-6">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-3 shadow-inner group transition-all duration-300 hover:bg-white/30">
              <Building2 className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              HCMS
            </CardTitle>
            <CardDescription className="text-white/60 text-center font-medium">
              {isRegister ? 'Create your campus account' : 'Welcome back to your hostel portal'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-white/80 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-white/80 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="password" className="text-white/80 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/80 ml-1">I am a...</Label>
                  <Select value={role} onValueChange={(value: 'student' | 'guard') => setRole(value)}>
                    <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-blue-500/50">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10 text-white">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="guard">Warder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2 group">
                      <Label htmlFor="hostelBlock" className="text-white/80 ml-1">Block</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="hostelBlock"
                          type="text"
                          placeholder="A"
                          className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          value={hostelBlock}
                          onChange={(e) => setHostelBlock(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <Label htmlFor="roomNumber" className="text-white/80 ml-1">Room</Label>
                      <div className="relative">
                        <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="roomNumber"
                          type="text"
                          placeholder="101"
                          className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <Button 
                variant="link" 
                onClick={() => setIsRegister(!isRegister)} 
                className="text-blue-400 hover:text-blue-300 font-bold ml-1 p-0 h-auto transition-colors"
              >
                {isRegister ? 'Login' : 'Register Now'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;