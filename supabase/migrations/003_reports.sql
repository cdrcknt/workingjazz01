/*
  # Reports Module Schema

  1. New Tables
    - `report_templates`
      - Stores report templates and their configurations
    - `generated_reports`
      - Stores generated report data and metadata
    - `user_logs`
      - Tracks user activities in the system
    - `report_downloads`
      - Tracks report download history

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    template_data jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create generated_reports table
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

-- Create user_logs table
CREATE TABLE IF NOT EXISTS user_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    module text NOT NULL,
    details jsonb,
    ip_address text,
    created_at timestamptz DEFAULT now()
);

-- Create report_downloads table
CREATE TABLE IF NOT EXISTS report_downloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid REFERENCES generated_reports(id),
    downloaded_by uuid REFERENCES auth.users(id),
    download_date timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Report Templates policies
    CREATE POLICY "Users can view report templates"
        ON report_templates FOR SELECT
        TO authenticated
        USING (true);

    -- Generated Reports policies
    CREATE POLICY "Users can view their generated reports"
        ON generated_reports FOR SELECT
        TO authenticated
        USING (generated_by = auth.uid());

    CREATE POLICY "Users can create reports"
        ON generated_reports FOR INSERT
        TO authenticated
        WITH CHECK (generated_by = auth.uid());

    -- User Logs policies
    CREATE POLICY "Users can view their own logs"
        ON user_logs FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());

    CREATE POLICY "System can create logs"
        ON user_logs FOR INSERT
        TO authenticated
        WITH CHECK (true);

    -- Report Downloads policies
    CREATE POLICY "Users can view their downloads"
        ON report_downloads FOR SELECT
        TO authenticated
        USING (downloaded_by = auth.uid());

    CREATE POLICY "Users can record downloads"
        ON report_downloads FOR INSERT
        TO authenticated
        WITH CHECK (downloaded_by = auth.uid());
END $$;