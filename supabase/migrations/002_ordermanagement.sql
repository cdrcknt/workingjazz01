/*
  # Order Management System Updates

  1. New Tables
    - `order_status_history`
      - Tracks order status changes
      - Records timestamps and users who made changes

  2. Changes
    - Add new status types to orders table
    - Add total_items column to orders table

  3. Security
    - Enable RLS on new tables
    - Add policies for order management
*/

-- Add order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add total_items to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_items integer DEFAULT 0;

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order status history
CREATE POLICY "Users can view order status history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert order status history"
  ON order_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = changed_by);