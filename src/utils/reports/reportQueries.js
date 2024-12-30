import { supabase } from '../supabaseClient';

export const fetchSalesData = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      orders (
        order_number,
        order_items (
          quantity,
          unit_price,
          products (name)
        )
      )
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchProductData = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      quantity,
      unit_price,
      products (
        name,
        category
      )
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) throw error;
  return data;
};

export const fetchUserLogs = async (startDate, endDate) => {
  const { data, error } = await supabase
    .from('user_logs')
    .select(`
      *,
      auth.users (email)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchInventoryData = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      stock_levels (
        current_stock,
        threshold_level
      )
    `)
    .order('name');

  if (error) throw error;
  return data;
};