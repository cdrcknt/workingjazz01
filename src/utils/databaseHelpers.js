import { supabase } from './supabaseClient';

// Supabase helpers
export const supabaseQuery = async (table, query) => {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Supabase ${table} query error:`, error);
    throw error;
  }
};

// Generic CRUD operations
export const createRecord = async (table, data) => {
  return supabaseQuery(table, supabase
    .from(table)
    .insert([data])
    .select()
  );
};

export const getRecords = async (table, query = {}) => {
  let dbQuery = supabase.from(table).select();
  
  if (query.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      dbQuery = dbQuery.eq(key, value);
    });
  }
  
  return supabaseQuery(table, dbQuery);
};

export const updateRecord = async (table, id, data) => {
  return supabaseQuery(table, supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
  );
};

export const deleteRecord = async (table, id) => {
  return supabaseQuery(table, supabase
    .from(table)
    .delete()
    .eq('id', id)
  );
};