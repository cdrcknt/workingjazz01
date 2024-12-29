import React, { useState } from 'react';
import { User, Lock, ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { registerUser } from '../utils/api';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({ email, password });
      navigate('/', { 
        state: { 
          message: 'Registration successful! Please login with your credentials.' 
        }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 px-4 py-12">
      <AuthCard
        title="Create Account"
        subtitle="Jazz Coffee Management System"
      >
        <form onSubmit={handleRegister} className="space-y-6">
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
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <AuthInput
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <AuthInput
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <AuthButton type="submit" isLoading={isLoading}>
              <UserPlus className="w-5 h-5" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </AuthButton>

            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </AuthButton>
          </div>
        </form>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-500">
            By registering, you agree to our Terms of Service
          </p>
        </div>
      </AuthCard>
    </div>
  );
};

export default RegisterScreen;