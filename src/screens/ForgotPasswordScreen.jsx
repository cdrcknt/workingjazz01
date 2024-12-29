import React, { useState } from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { supabase } from '../utils/supabaseClient';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 px-4 py-12">
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email to reset password"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <AuthButton type="submit" isLoading={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordScreen;