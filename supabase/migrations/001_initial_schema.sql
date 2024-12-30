/*
  # Complete Store Management System Database Setup
  
  This migration creates all necessary tables and security policies for the system.
  
  Tables:
  1. Core Tables
    - employees (user management)
    - products (inventory)
  2. Time Management
    - time_entries (clock in/out)
    - schedules (work schedules)
  3. Supplier Management
    - suppliers (supplier information)
    - supplier_orders (order tracking)
  4. Maintenance
    - archived_products (product history)
    - data_backups (system backups)
  5. Promotions and Loyalty
    - promotions (promotional campaigns)
    - discount_types (types of discounts)
    - customer_loyalty (loyalty program members)
    - loyalty_rewards (available rewards)
  
  Security:
    - Row Level Security (RLS) enabled on all tables
    - Appropriate policies for authenticated users
*/

-- Create update_updated_at_column function first (needed for triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create core tables
CREATE TABLE IF NOT EXISTS employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    name text NOT NULL,
    birth_date date NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id text UNIQUE NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL,
    category text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users NOT NULL
);

-- Create time management tables
CREATE TABLE IF NOT EXISTS time_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
    clock_in timestamptz NOT NULL,
    clock_out timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create supplier management tables
CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    category text NOT NULL,
    payment_terms text NOT NULL,
    delivery_method text NOT NULL,
    tax_id text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supplier_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
    order_number text UNIQUE NOT NULL,
    order_date date NOT NULL,
    delivery_date date,
    status text NOT NULL,
    total_amount numeric NOT NULL,
    payment_status text NOT NULL,
    delivery_method text NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
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

-- Create promotions and loyalty tables
CREATE TABLE IF NOT EXISTS promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    promotion_type text NOT NULL,
    discount_type text NOT NULL,
    discount_value numeric NOT NULL,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    criteria jsonb DEFAULT '{}',
    is_active boolean DEFAULT true,
    is_archived boolean DEFAULT false,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discount_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    discount_value numeric NOT NULL,
    verification_required boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_loyalty (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    contact_number text,
    email text,
    total_points numeric DEFAULT 0,
    total_orders integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    points_required integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

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

    -- Suppliers policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can view suppliers') THEN
        CREATE POLICY "Users can view suppliers" ON suppliers FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can insert suppliers') THEN
        CREATE POLICY "Users can insert suppliers" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can update suppliers') THEN
        CREATE POLICY "Users can update suppliers" ON suppliers FOR UPDATE TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Users can delete suppliers') THEN
        CREATE POLICY "Users can delete suppliers" ON suppliers FOR DELETE TO authenticated USING (true);
    END IF;

    -- Supplier orders policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can view orders') THEN
        CREATE POLICY "Users can view orders" ON supplier_orders FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can insert orders') THEN
        CREATE POLICY "Users can insert orders" ON supplier_orders FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can update orders') THEN
        CREATE POLICY "Users can update orders" ON supplier_orders FOR UPDATE TO authenticated USING (true);
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

    -- Promotions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Users can view promotions') THEN
        CREATE POLICY "Users can view promotions" ON promotions FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Users can create promotions') THEN
        CREATE POLICY "Users can create promotions" ON promotions FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Users can update own promotions') THEN
        CREATE POLICY "Users can update own promotions" ON promotions FOR UPDATE TO authenticated USING (auth.uid() = created_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'promotions' AND policyname = 'Users can delete own promotions') THEN
        CREATE POLICY "Users can delete own promotions" ON promotions FOR DELETE TO authenticated USING (auth.uid() = created_by);
    END IF;

    -- Discount types policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discount_types' AND policyname = 'Users can view discount types') THEN
        CREATE POLICY "Users can view discount types" ON discount_types FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discount_types' AND policyname = 'Users can create discount types') THEN
        CREATE POLICY "Users can create discount types" ON discount_types FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'discount_types' AND policyname = 'Users can update discount types') THEN
        CREATE POLICY "Users can update discount types" ON discount_types FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Customer loyalty policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_loyalty' AND policyname = 'Users can view customer loyalty') THEN
        CREATE POLICY "Users can view customer loyalty" ON customer_loyalty FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_loyalty' AND policyname = 'Users can create customer loyalty') THEN
        CREATE POLICY "Users can create customer loyalty" ON customer_loyalty FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_loyalty' AND policyname = 'Users can update customer loyalty') THEN
        CREATE POLICY "Users can update customer loyalty" ON customer_loyalty FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Loyalty rewards policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'loyalty_rewards' AND policyname = 'Users can view loyalty rewards') THEN
        CREATE POLICY "Users can view loyalty rewards" ON loyalty_rewards FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'loyalty_rewards' AND policyname = 'Users can create loyalty rewards') THEN
        CREATE POLICY "Users can create loyalty rewards" ON loyalty_rewards FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'loyalty_rewards' AND policyname = 'Users can update loyalty rewards') THEN
        CREATE POLICY "Users can update loyalty rewards" ON loyalty_rewards FOR UPDATE TO authenticated USING (true);
    END IF;
END $$;

-- Create update triggers for all tables
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_orders_updated_at
    BEFORE UPDATE ON supplier_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_types_updated_at
    BEFORE UPDATE ON discount_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_loyalty_updated_at
    BEFORE UPDATE ON customer_loyalty
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
    BEFORE UPDATE ON loyalty_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();