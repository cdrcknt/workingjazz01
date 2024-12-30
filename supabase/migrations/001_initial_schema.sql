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
  4. Order Management
    - order_types
    - orders
    - order_items
    - customizations
    - order_item_customizations
  5. Maintenance
    - archived_products (product history)
    - data_backups (system backups)
  6. Promotions and Loyalty
    - promotions (promotional campaigns)
    - discount_types (types of discounts)
    - customer_loyalty (loyalty program members)
    - loyalty_rewards (available rewards)
  7. Inventory Management
    - stock_levels (current stock and thresholds)
    - stock_movements (stock change audit trail)
  8. Payment System
    - transactions (payment transaction details)
    - transaction_denominations (cash denominations tracking)
    - daily_reconciliations (cash reconciliation records)
  9. Reports Module
    - report_templates (report configurations)
    - generated_reports (report data and metadata)
    - user_logs (user activity tracking)
    - report_downloads (report download history)
  
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

-- Create inventory management tables
CREATE TABLE IF NOT EXISTS stock_levels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    current_stock integer NOT NULL DEFAULT 0,
    threshold_level integer NOT NULL DEFAULT 10,
    last_updated timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    movement_type text NOT NULL CHECK (movement_type IN ('add', 'remove')),
    quantity integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
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

-- Create order management tables
CREATE TABLE IF NOT EXISTS order_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    total_amount numeric NOT NULL DEFAULT 0,
    notes text,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id),
    quantity integer NOT NULL,
    unit_price numeric NOT NULL,
    subtotal numeric NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_item_customizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE,
    customization_id uuid REFERENCES customizations(id),
    quantity integer NOT NULL DEFAULT 1,
    price numeric NOT NULL,
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

CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) NOT NULL,
    total_amount numeric NOT NULL,
    discount_amount numeric DEFAULT 0,
    discount_type text,
    promotion_id uuid REFERENCES promotions(id),
    final_amount numeric NOT NULL,
    amount_tendered numeric NOT NULL,
    change_amount numeric NOT NULL,
    payment_status text NOT NULL DEFAULT 'pending',
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transaction_denominations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid REFERENCES transactions(id) NOT NULL,
    denomination numeric NOT NULL,
    quantity integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_reconciliations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_date date NOT NULL,
    expected_amount numeric NOT NULL,
    actual_amount numeric NOT NULL,
    discrepancy_amount numeric DEFAULT 0,
    status text NOT NULL DEFAULT 'pending',
    notes text,
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    template_data jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES report_templates(id),
    report_type text NOT NULL,
    parameters jsonb NOT NULL,
    report_data jsonb NOT NULL,
    generated_by uuid REFERENCES auth.users(id),
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    module text NOT NULL,
    details jsonb,
    ip_address text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_downloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid REFERENCES generated_reports(id),
    downloaded_by uuid REFERENCES auth.users(id),
    download_date timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_denominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_downloads ENABLE ROW LEVEL SECURITY;

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

    -- Stock Levels policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_levels' AND policyname = 'Users can view stock levels') THEN
        CREATE POLICY "Users can view stock levels" 
        ON stock_levels FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_levels' AND policyname = 'Users can update stock levels') THEN
        CREATE POLICY "Users can update stock levels" 
        ON stock_levels FOR UPDATE 
        TO authenticated 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_levels' AND policyname = 'Users can insert stock levels') THEN
        CREATE POLICY "Users can insert stock levels" 
        ON stock_levels FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
    END IF;

    -- Stock Movements policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_movements' AND policyname = 'Users can view stock movements') THEN
        CREATE POLICY "Users can view stock movements" 
        ON stock_movements FOR SELECT 
        TO authenticated 
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_movements' AND policyname = 'Users can insert stock movements') THEN
        CREATE POLICY "Users can insert stock movements" 
        ON stock_movements FOR INSERT 
        TO authenticated 
        WITH CHECK (created_by = auth.uid());
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
    CREATE POLICY "Users can view orders" 
    ON supplier_orders 
    FOR SELECT 
    TO authenticated 
    USING (true);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can insert orders') THEN
    CREATE POLICY "Users can insert orders" 
    ON supplier_orders 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can update orders') THEN
    CREATE POLICY "Users can update orders" 
    ON supplier_orders 
    FOR UPDATE 
    TO authenticated 
    USING (true);
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_orders' AND policyname = 'Users can delete orders') THEN
    CREATE POLICY "Users can delete orders" 
    ON supplier_orders 
    FOR DELETE 
    TO authenticated 
    USING (true);
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

    -- Order types policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_types' AND policyname = 'Users can view order types') THEN
        CREATE POLICY "Users can view order types" ON order_types FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_types' AND policyname = 'Users can manage order types') THEN
        CREATE POLICY "Users can manage order types" ON order_types FOR ALL TO authenticated USING (true);
    END IF;

    -- Orders policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view orders') THEN
        CREATE POLICY "Users can view orders" ON orders FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can create orders') THEN
        CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can update orders') THEN
        CREATE POLICY "Users can update orders" ON orders FOR UPDATE TO authenticated USING (true);
    END IF;

    -- Order items policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view order items') THEN
        CREATE POLICY "Users can view order items" ON order_items FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can manage order items') THEN
        CREATE POLICY "Users can manage order items" ON order_items FOR ALL TO authenticated USING (true);
    END IF;

    -- Customizations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customizations' AND policyname = 'Users can view customizations') THEN
        CREATE POLICY "Users can view customizations" ON customizations FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customizations' AND policyname = 'Users can manage customizations') THEN
        CREATE POLICY "Users can manage customizations" ON customizations FOR ALL TO authenticated USING (true);
    END IF;

    -- Order item customizations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_item_customizations' AND policyname = 'Users can view order item customizations') THEN
        CREATE POLICY "Users can view order item customizations" ON order_item_customizations FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_item_customizations' AND policyname = 'Users can manage order item customizations') THEN
        CREATE POLICY "Users can manage order item customizations" ON order_item_customizations FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table in auth schema if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Consolidate all policies into a single DO block for atomic execution
DO $$ 
BEGIN
    -- Transactions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can view transactions') THEN
        CREATE POLICY "Users can view transactions" 
            ON transactions FOR SELECT 
            TO authenticated 
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can create transactions') THEN
        CREATE POLICY "Users can create transactions" 
            ON transactions FOR INSERT 
            TO authenticated 
            WITH CHECK (auth.uid() = created_by);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can delete transactions') THEN
        CREATE POLICY "Users can delete transactions" 
            ON transactions FOR DELETE 
            TO authenticated 
            USING (auth.uid() = created_by);
    END IF;

    -- Transaction denominations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transaction_denominations' AND policyname = 'Users can view transaction denominations') THEN
        CREATE POLICY "Users can view transaction denominations" 
            ON transaction_denominations FOR SELECT 
            TO authenticated 
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transaction_denominations' AND policyname = 'Users can create transaction denominations') THEN
        CREATE POLICY "Users can create transaction denominations" 
            ON transaction_denominations FOR INSERT 
            TO authenticated 
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transaction_denominations' AND policyname = 'Users can delete transaction denominations') THEN
        CREATE POLICY "Users can delete transaction denominations" 
            ON transaction_denominations FOR DELETE 
            TO authenticated 
            USING (true);
    END IF;

    -- Daily reconciliations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_reconciliations' AND policyname = 'Users can view daily reconciliations') THEN
        CREATE POLICY "Users can view daily reconciliations" 
            ON daily_reconciliations FOR SELECT 
            TO authenticated 
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_reconciliations' AND policyname = 'Users can create daily reconciliations') THEN
        CREATE POLICY "Users can create daily reconciliations" 
            ON daily_reconciliations FOR INSERT 
            TO authenticated 
            WITH CHECK (auth.uid() = created_by);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_reconciliations' AND policyname = 'Users can update daily reconciliations') THEN
        CREATE POLICY "Users can update daily reconciliations" 
            ON daily_reconciliations FOR UPDATE 
            TO authenticated 
            USING (auth.uid() = created_by);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_reconciliations' AND policyname = 'Users can delete daily reconciliations') THEN
        CREATE POLICY "Users can delete daily reconciliations" 
            ON daily_reconciliations FOR DELETE 
            TO authenticated 
            USING (auth.uid() = created_by);
    END IF;

    -- Report Templates policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_templates' AND policyname = 'Users can view report templates') THEN
        CREATE POLICY "Users can view report templates"
            ON report_templates FOR SELECT
            TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_templates' AND policyname = 'Users can delete report templates') THEN
        CREATE POLICY "Users can delete report templates"
            ON report_templates FOR DELETE
            TO authenticated
            USING (true);
    END IF;

    -- Generated Reports policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'generated_reports' AND policyname = 'Users can view their generated reports') THEN
        CREATE POLICY "Users can view their generated reports"
            ON generated_reports FOR SELECT
            TO authenticated
            USING (generated_by = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'generated_reports' AND policyname = 'Users can create reports') THEN
        CREATE POLICY "Users can create reports"
            ON generated_reports FOR INSERT
            TO authenticated
            WITH CHECK (generated_by = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'generated_reports' AND policyname = 'Users can delete their reports') THEN
        CREATE POLICY "Users can delete their reports"
            ON generated_reports FOR DELETE
            TO authenticated
            USING (generated_by = auth.uid());
    END IF;

    -- User Logs policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_logs' AND policyname = 'Users can view their own logs') THEN
        CREATE POLICY "Users can view their own logs"
            ON user_logs FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_logs' AND policyname = 'System can create logs') THEN
        CREATE POLICY "System can create logs"
            ON user_logs FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_logs' AND policyname = 'Users can delete their own logs') THEN
        CREATE POLICY "Users can delete their own logs"
            ON user_logs FOR DELETE
            TO authenticated
            USING (user_id = auth.uid());
    END IF;

    -- Report Downloads policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_downloads' AND policyname = 'Users can view their downloads') THEN
        CREATE POLICY "Users can view their downloads"
            ON report_downloads FOR SELECT
            TO authenticated
            USING (downloaded_by = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_downloads' AND policyname = 'Users can record downloads') THEN
        CREATE POLICY "Users can record downloads"
            ON report_downloads FOR INSERT
            TO authenticated
            WITH CHECK (downloaded_by = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_downloads' AND policyname = 'Users can delete their downloads') THEN
        CREATE POLICY "Users can delete their downloads"
            ON report_downloads FOR DELETE
            TO authenticated
            USING (downloaded_by = auth.uid());
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

CREATE TRIGGER update_stock_levels_updated_at
    BEFORE UPDATE ON stock_levels
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

CREATE TRIGGER update_order_types_updated_at
    BEFORE UPDATE ON order_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customizations_updated_at
    BEFORE UPDATE ON customizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_item_customizations_updated_at
    BEFORE UPDATE ON order_item_customizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_reconciliations_updated_at
    BEFORE UPDATE ON daily_reconciliations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
    BEFORE UPDATE ON report_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_reports_updated_at
    BEFORE UPDATE ON generated_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_logs_updated_at
    BEFORE UPDATE ON user_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_downloads_updated_at
    BEFORE UPDATE ON report_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();