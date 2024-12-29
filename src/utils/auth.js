import { supabase } from './supabaseClient';

// Sets the auth data in localStorage
export const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Sign in the user using Supabase
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Structure the response to match your app's expectations
  const authData = {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role || 'admin', // Default to admin or handle as needed
    },
  };

  setAuth(authData.token, authData.user);
  return authData;
};

// Register a new user in Supabase
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'admin' // Set default role
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: 'Registration successful',
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role
    }
  };
};

// Reset user password via Supabase
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { message: 'Password reset email sent' };
};

// Sign out the user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get the current logged-in user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    return user ? {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role || 'admin'
    } : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get stored auth data
export const getAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  return { token, user };
};