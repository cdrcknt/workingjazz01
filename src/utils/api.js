import { supabase } from './supabaseClient';

export const loginUser = async (credentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    
    // Verify user role matches requested role
    if (data.user.user_metadata.role !== credentials.role) {
      throw new Error(`Invalid login. This account is not registered as ${credentials.role}`);
    }
    
    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to connect to server');
  }
};

export const registerUser = async (userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) throw new Error(error.message);

    return {
      message: 'Registration successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role
      }
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to register');
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw new Error(error.message);
    
    return { message: 'Password reset email sent' };
  } catch (error) {
    throw new Error(error.message || 'Failed to request password reset');
  }
};