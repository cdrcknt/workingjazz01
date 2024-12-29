import { supabase } from './supabaseClient';

export const handleAuthResponse = async (response) => {
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
};

export const supabaseSignIn = async (email, password) => {
  const response = await supabase.auth.signInWithPassword({ email, password });
  return handleAuthResponse(response);
};

export const supabaseSignUp = async (email, password) => {
  const response = await supabase.auth.signUp({ email, password });
  return handleAuthResponse(response);
};

export const supabaseSignOut = async () => {
  const response = await supabase.auth.signOut();
  return handleAuthResponse(response);
};