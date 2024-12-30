/*
  # Payment System Schema

  1. New Tables
    - `transactions`
      - Stores payment transaction details
      - Links to orders
      - Tracks payment amounts, discounts, and change
    
    - `transaction_denominations`
      - Records cash denominations for each transaction
      - Helps with cash reconciliation
    
    - `daily_reconciliations`
      - Stores daily cash reconciliation records
      - Tracks expected vs actual cash amounts
      - Records discrepancies if any

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) NOT NULL,
    total_amount numeric NOT NULL,
    discount_amount numeric DEFAULT 0,
    discount_type text, -- 'manual' or 'automatic'
    promotion_id uuid REFERENCES promotions(id),
    final_amount numeric NOT NULL,
    amount_tendered numeric NOT NULL,
    change_amount numeric NOT NULL,
    payment_status text NOT NULL DEFAULT 'pending',
    created_by uuid REFERENCES auth.users(id) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create transaction_denominations table
CREATE TABLE IF NOT EXISTS transaction_denominations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid REFERENCES transactions(id) NOT NULL,
    denomination numeric NOT NULL,
    quantity integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create daily_reconciliations table
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

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_denominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reconciliations ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Transactions policies
    CREATE POLICY "Users can view transactions" 
        ON transactions FOR SELECT 
        TO authenticated 
        USING (true);

    CREATE POLICY "Users can create transactions" 
        ON transactions FOR INSERT 
        TO authenticated 
        WITH CHECK (auth.uid() = created_by);

    -- Transaction denominations policies
    CREATE POLICY "Users can view transaction denominations" 
        ON transaction_denominations FOR SELECT 
        TO authenticated 
        USING (true);

    CREATE POLICY "Users can create transaction denominations" 
        ON transaction_denominations FOR INSERT 
        TO authenticated 
        WITH CHECK (true);

    -- Daily reconciliations policies
    CREATE POLICY "Users can view daily reconciliations" 
        ON daily_reconciliations FOR SELECT 
        TO authenticated 
        USING (true);

    CREATE POLICY "Users can create daily reconciliations" 
        ON daily_reconciliations FOR INSERT 
        TO authenticated 
        WITH CHECK (auth.uid() = created_by);

    CREATE POLICY "Users can update daily reconciliations" 
        ON daily_reconciliations FOR UPDATE 
        TO authenticated 
        USING (auth.uid() = created_by);
END $$;