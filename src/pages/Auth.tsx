import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { register, login } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop")',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl">
        
        {/* Left Side: Welcome Text */}
        <div className="w-full md:w-1/2 text-white space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            Welcome<br />Back
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed">
            HCMS - Hostel Complaint Management System. Streamlining campus life one request at a time. Access your portal to manage and track hostel issues.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <Facebook className="h-6 w-6 cursor-pointer hover:text-blue-400 transition-colors" />
            <Twitter className="h-6 w-6 cursor-pointer hover:text-sky-400 transition-colors" />
            <Instagram className="h-6 w-6 cursor-pointer hover:text-pink-400 transition-colors" />
            <Youtube className="h-6 w-6 cursor-pointer hover:text-red-500 transition-colors" />
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="w-full md:w-[450px] animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">
              {isRegister ? 'Sign up' : 'Sign in'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="h-12 bg-white border-none text-black focus-visible:ring-2 focus-visible:ring-orange-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-12 bg-white border-none text-black focus-visible:ring-2 focus-visible:ring-orange-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-12 bg-white border-none text-black focus-visible:ring-2 focus-visible:ring-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegister && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white font-medium">I am a...</Label>
                    <Select value={role} onValueChange={(value: 'student' | 'guard') => setRole(value)}>
                      <SelectTrigger id="role" className="h-12 bg-white border-none text-black">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="guard">Warder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {role === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hostelBlock" className="text-white font-medium">Block</Label>
                        <Input
                          id="hostelBlock"
                          type="text"
                          className="h-12 bg-white border-none text-black"
                          value={hostelBlock}
                          onChange={(e) => setHostelBlock(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roomNumber" className="text-white font-medium">Room</Label>
                        <Input
                          id="roomNumber"
                          type="text"
                          className="h-12 bg-white border-none text-black"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-white data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none text-white cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#d9531e] hover:bg-[#bf4618] text-white font-bold text-lg transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  isRegister ? 'Sign up now' : 'Sign in now'
                )}
              </Button>
            </form>

            <div className="space-y-4 pt-2">
              {!isRegister && (
                <p className="text-white/80 text-sm cursor-pointer hover:text-white transition-colors">
                  Lost your password?
                </p>
              )}
              <p className="text-white/60 text-sm">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button 
                  onClick={() => setIsRegister(!isRegister)} 
                  className="text-white font-bold ml-2 hover:underline"
                >
                  {isRegister ? 'Sign in' : 'Register Now'}
                </button>
              </p>
              
              <p className="text-white/40 text-[10px] leading-relaxed pt-4">
                By clicking on "{isRegister ? 'Sign up now' : 'Sign in now'}" you agree to <br />
                <span className="underline cursor-pointer">Terms of Service</span> | <span className="underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;