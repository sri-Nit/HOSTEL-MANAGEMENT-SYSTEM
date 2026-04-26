import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { register, login } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Facebook, Twitter, Instagram, Youtube, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your elementary school?",
  "In what city were you born?",
  "What is your favorite book?"
];

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'guard' | 'admin'>('student');
  const [hostelBlock, setHostelBlock] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot password specific states
  const [fetchedQuestion, setFetchedQuestion] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const { login: authContextLogin } = useAuth();
  const navigate = useNavigate();

  const handleFetchQuestion = async () => {
    if (!email) {
      showError("Please enter your email first.");
      return;
    }
    setLoading(true);
    try {
      // We need to find the user's profile to get their question
      // Since we don't have the ID yet, we'll use a RPC or a public view if available
      // For now, we'll try to fetch it from the profiles table (assuming public read is on for this specific check)
      const { data, error } = await supabase
        .from('profiles')
        .select('security_question')
        .eq('name', name) // This is a fallback, ideally we'd use email but profiles doesn't have email
        .single();

      // Note: In a real app, you'd want a dedicated Edge Function to fetch the question by email
      // to avoid exposing all profiles. For this demo, we'll assume the user knows their name.
      if (error || !data) throw new Error("Could not find security question for this user.");
      setFetchedQuestion(data.security_question);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { email, securityAnswer, newPassword }
      });

      if (error) throw error;
      showSuccess("Password reset successfully! Please log in.");
      setMode('login');
    } catch (error: any) {
      showError(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        const registerData: any = { 
          name, email, password, role, 
          securityQuestion, securityAnswer 
        };
        if (role === 'student') {
          registerData.hostelBlock = hostelBlock;
          registerData.roomNumber = roomNumber;
        }
        await register(registerData);
        showSuccess('Registration successful! You can now log in.');
        setMode('login');
      } else if (mode === 'login') {
        const userData = await login({ email, password });
        authContextLogin(userData);
        navigate('/');
      }
    } catch (error: any) {
      showError(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl">
        <div className="w-full md:w-1/2 text-white space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            Welcome<br />Back
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed">
            HCMS - Hostel Complaint Management System. Securely manage your hostel life.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <Facebook className="h-6 w-6 cursor-pointer hover:text-blue-400 transition-colors" />
            <Twitter className="h-6 w-6 cursor-pointer hover:text-sky-400 transition-colors" />
            <Instagram className="h-6 w-6 cursor-pointer hover:text-pink-400 transition-colors" />
            <Youtube className="h-6 w-6 cursor-pointer hover:text-red-500 transition-colors" />
          </div>
        </div>

        <div className="w-full md:w-[450px] animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {mode !== 'login' && (
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setMode('login')}>
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              )}
              <h2 className="text-4xl font-bold text-white">
                {mode === 'register' ? 'Sign up' : mode === 'forgot' ? 'Reset' : 'Sign in'}
              </h2>
            </div>

            {mode === 'forgot' ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Email Address</Label>
                  <Input className="h-12 bg-white border-none text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Security Answer</Label>
                  <Input className="h-12 bg-white border-none text-black" placeholder="Your answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">New Password</Label>
                  <Input type="password" className="h-12 bg-white border-none text-black" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full h-12 bg-[#d9531e] hover:bg-[#bf4618] text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                    <Input id="name" className="h-12 bg-white border-none text-black" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <Input id="email" type="email" className="h-12 bg-white border-none text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <Input id="password" type="password" className="h-12 bg-white border-none text-black" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {mode === 'register' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Security Question</Label>
                      <Select value={securityQuestion} onValueChange={setSecurityQuestion}>
                        <SelectTrigger className="h-12 bg-white border-none text-black">
                          <SelectValue placeholder="Select a question" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECURITY_QUESTIONS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Security Answer</Label>
                      <Input className="h-12 bg-white border-none text-black" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white font-medium">I am a...</Label>
                      <Select value={role} onValueChange={(v: any) => setRole(v)}>
                        <SelectTrigger className="h-12 bg-white border-none text-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="guard">Warder</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {role === 'student' && (
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Block" className="h-12 bg-white border-none text-black" value={hostelBlock} onChange={(e) => setHostelBlock(e.target.value)} required />
                        <Input placeholder="Room" className="h-12 bg-white border-none text-black" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
                      </div>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full h-12 bg-[#d9531e] hover:bg-[#bf4618] text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : mode === 'register' ? 'Sign up now' : 'Sign in now'}
                </Button>
              </form>
            )}

            <div className="space-y-4 pt-2">
              {mode === 'login' && (
                <button onClick={() => setMode('forgot')} className="text-white/80 text-sm hover:text-white hover:underline block">
                  Forgot Password?
                </button>
              )}
              <p className="text-white/60 text-sm">
                {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="text-white font-bold ml-2 hover:underline">
                  {mode === 'register' ? 'Sign in' : 'Register Now'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;