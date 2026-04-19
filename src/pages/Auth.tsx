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
import { Loader2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isRegister ? 'Register for HCMS' : 'Login to HCMS'}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegister ? 'Create your account' : 'Enter your credentials to access your dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isRegister && (
              <>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: 'student' | 'guard') => setRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="guard">Guard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {role === 'student' && (
                  <>
                    <div>
                      <Label htmlFor="hostelBlock">Hostel Block</Label>
                      <Input
                        id="hostelBlock"
                        type="text"
                        placeholder="Block A"
                        value={hostelBlock}
                        onChange={(e) => setHostelBlock(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="roomNumber">Room Number</Label>
                      <Input
                        id="roomNumber"
                        type="text"
                        placeholder="101"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsRegister(false)} className="p-0 h-auto">
                  Login
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button variant="link" onClick={() => setIsRegister(true)} className="p-0 h-auto">
                  Register
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Auth;