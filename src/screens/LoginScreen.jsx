import React, { useState, useEffect } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { loginUser } from '../utils/api';
import { setAuth } from '../utils/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await loginUser({ email, password, role });
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 px-4 py-12">
      <AuthCard
        title="Welcome Back"
        subtitle="Jazz Coffee Management System"
      >
        <form onSubmit={handleLogin} className="space-y-6">
          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <AuthInput
              type="email"
              icon={User}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link 
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <AuthInput
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Login As
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('employee')}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  role === 'employee'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Employee
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <AuthButton type="submit" isLoading={isLoading}>
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </AuthButton>

            {role === 'admin' && (
              <AuthButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/register')}
              >
                Create Admin Account
              </AuthButton>
            )}
          </div>
        </form>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Protected by enterprise-grade security
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginScreen;