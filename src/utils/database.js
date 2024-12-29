import { supabase } from './supabaseClient';

export const createEmployee = async (employeeData) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user?.id) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('employees')
    .insert([{ ...employeeData, user_id: authData.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

export const createProduct = async (productData) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user?.id) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData, user_id: authData.user.id }])
    .select();

  if (error) throw error;
  return data[0];
};