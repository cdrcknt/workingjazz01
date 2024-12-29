/*
  # Jazz Coffee Management System - Complete Database Setup
  
  This migration creates all necessary tables and security policies for the system.
  
  Tables:
  1. Core Tables
    - employees (user management)
    - products (inventory)
  2. Time Management
    - time_entries (clock in/out)
    - schedules (work schedules)
  3. Maintenance
    - archived_products (product history)
    - data_backups (system backups)
  
  Security:
    - Row Level Security (RLS) enabled on all tables
    - Appropriate policies for authenticated users
*/

-- Create core tables
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL,
  name text NOT NULL,
  birth_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Create time management tables
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  clock_in timestamptz NOT NULL,
  clock_out timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create maintenance tables
CREATE TABLE IF NOT EXISTS archived_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  archived_at timestamptz DEFAULT now(),
  archived_by uuid REFERENCES auth.users(id),
  reason text
);

CREATE TABLE IF NOT EXISTS data_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  backup_type text NOT NULL,
  status text NOT NULL,
  metadata jsonb
);

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_backups ENABLE ROW LEVEL SECURITY;

-- Create policies safely using DO blocks
DO $$ 
BEGIN
    -- Employees policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can view their own employees') THEN
        CREATE POLICY "Users can view their own employees" ON employees FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can insert their own employees') THEN
        CREATE POLICY "Users can insert their own employees" ON employees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can update their own employees') THEN
        CREATE POLICY "Users can update their own employees" ON employees FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'Users can delete their own employees') THEN
        CREATE POLICY "Users can delete their own employees" ON employees FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;

    -- Products policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Users can view their own products') THEN
        CREATE POLICY "Users can view their own products" ON products FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Users can insert their own products') THEN
        CREATE POLICY "Users can insert their own products" ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Users can update their own products') THEN
        CREATE POLICY "Users can update their own products" ON products FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Users can delete their own products') THEN
        CREATE POLICY "Users can delete their own products" ON products FOR DELETE TO authenticated USING (auth.uid() = user_id);
    END IF;

    -- Time entries policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can view time entries') THEN
        CREATE POLICY "Users can view time entries" ON time_entries FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can insert time entries') THEN
        CREATE POLICY "Users can insert time entries" ON time_entries FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'time_entries' AND policyname = 'Users can update time entries') THEN
        CREATE POLICY "Users can update time entries" ON time_entries FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Schedules policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schedules' AND policyname = 'Users can view schedules') THEN
        CREATE POLICY "Users can view schedules" ON schedules FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schedules' AND policyname = 'Users can insert schedules') THEN
        CREATE POLICY "Users can insert schedules" ON schedules FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schedules' AND policyname = 'Users can update schedules') THEN
        CREATE POLICY "Users can update schedules" ON schedules FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Archived products policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'archived_products' AND policyname = 'Users can view their archived products') THEN
        CREATE POLICY "Users can view their archived products" ON archived_products FOR SELECT TO authenticated USING (archived_by = auth.uid());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'archived_products' AND policyname = 'Users can insert their archived products') THEN
        CREATE POLICY "Users can insert their archived products" ON archived_products FOR INSERT TO authenticated WITH CHECK (archived_by = auth.uid());
    END IF;

    -- Data backups policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'data_backups' AND policyname = 'Users can view their backups') THEN
        CREATE POLICY "Users can view their backups" ON data_backups FOR SELECT TO authenticated USING (created_by = auth.uid());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'data_backups' AND policyname = 'Users can create backups') THEN
        CREATE POLICY "Users can create backups" ON data_backups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
    END IF;
END $$;