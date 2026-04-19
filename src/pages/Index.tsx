import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        switch (user?.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'guard':
            navigate('/guard/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/student/dashboard');
            break;
        }
      } else {
        navigate('/auth');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading application...</p>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to HCMS</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;