/*
  # Promotions and Loyalty Schema

  1. New Tables
    - promotions
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - promotion_type (text)
      - discount_type (text)
      - discount_value (numeric)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - criteria (jsonb)
      - is_active (boolean)
      - is_archived (boolean)
      - created_by (uuid)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - discount_types
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - discount_value (numeric)
      - verification_required (boolean)
      - is_active (boolean)

    - customer_loyalty
      - id (uuid, primary key)
      - customer_name (text)
      - contact_number (text)
      - email (text)
      - total_points (numeric)
      - total_orders (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - loyalty_rewards
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - points_required (integer)
      - is_active (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create promotions table
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

-- Create discount_types table
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

-- Create customer_loyalty table
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

-- Create loyalty_rewards table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    points_required integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Promotions policies
    CREATE POLICY "Users can view promotions" ON promotions
        FOR SELECT TO authenticated USING (true);
    
    CREATE POLICY "Users can create promotions" ON promotions
        FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
    
    CREATE POLICY "Users can update own promotions" ON promotions
        FOR UPDATE TO authenticated USING (auth.uid() = created_by);
    
    CREATE POLICY "Users can delete own promotions" ON promotions
        FOR DELETE TO authenticated USING (auth.uid() = created_by);

    -- Discount types policies
    CREATE POLICY "Users can view discount types" ON discount_types
        FOR SELECT TO authenticated USING (true);
    
    CREATE POLICY "Users can create discount types" ON discount_types
        FOR INSERT TO authenticated WITH CHECK (true);
    
    CREATE POLICY "Users can update discount types" ON discount_types
        FOR UPDATE TO authenticated USING (true);

    -- Customer loyalty policies
    CREATE POLICY "Users can view customer loyalty" ON customer_loyalty
        FOR SELECT TO authenticated USING (true);
    
    CREATE POLICY "Users can create customer loyalty" ON customer_loyalty
        FOR INSERT TO authenticated WITH CHECK (true);
    
    CREATE POLICY "Users can update customer loyalty" ON customer_loyalty
        FOR UPDATE TO authenticated USING (true);

    -- Loyalty rewards policies
    CREATE POLICY "Users can view loyalty rewards" ON loyalty_rewards
        FOR SELECT TO authenticated USING (true);
    
    CREATE POLICY "Users can create loyalty rewards" ON loyalty_rewards
        FOR INSERT TO authenticated WITH CHECK (true);
    
    CREATE POLICY "Users can update loyalty rewards" ON loyalty_rewards
        FOR UPDATE TO authenticated USING (true);
END $$;

-- Create update triggers
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