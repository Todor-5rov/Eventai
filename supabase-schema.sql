-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('organizer', 'partner')),
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners Table (Service Providers)
CREATE TABLE partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('venue', 'catering', 'merchandise', 'sponsor', 'other')),
  city TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Requests Table
CREATE TABLE event_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  attendees INTEGER NOT NULL,
  event_date DATE NOT NULL,
  budget DECIMAL(10, 2),
  city TEXT NOT NULL,
  needs_catering BOOLEAN DEFAULT FALSE,
  needs_merchandise BOOLEAN DEFAULT FALSE,
  needs_sponsors BOOLEAN DEFAULT FALSE,
  additional_notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Request Files (for merchandise)
CREATE TABLE event_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_request_id UUID REFERENCES event_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Inquiries (tracks which partners were contacted for each event)
CREATE TABLE event_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_request_id UUID REFERENCES event_requests(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  email_content TEXT NOT NULL,
  email_subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'opened', 'replied', 'declined')),
  gmail_message_id TEXT,
  has_attachment BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Selected Partners for Event Requests (many-to-many relationship)
CREATE TABLE event_selected_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_request_id UUID REFERENCES event_requests(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_request_id, partner_id)
);

-- Create indexes for performance
CREATE INDEX idx_partners_city ON partners(city);
CREATE INDEX idx_partners_service_type ON partners(service_type);
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_event_requests_organizer ON event_requests(organizer_id);
CREATE INDEX idx_event_requests_status ON event_requests(status);
CREATE INDEX idx_event_inquiries_event ON event_inquiries(event_request_id);
CREATE INDEX idx_event_inquiries_partner ON event_inquiries(partner_id);
CREATE INDEX idx_event_files_event ON event_files(event_request_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_selected_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for partners
CREATE POLICY "Anyone can view partners"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Partners can update own profile"
  ON partners FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can insert own profile"
  ON partners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for event_requests
CREATE POLICY "Organizers can view own requests"
  ON event_requests FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can create requests"
  ON event_requests FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own requests"
  ON event_requests FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own requests"
  ON event_requests FOR DELETE
  USING (auth.uid() = organizer_id);

-- RLS Policies for event_files
CREATE POLICY "Users can view files for their events"
  ON event_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_requests
      WHERE event_requests.id = event_files.event_request_id
      AND event_requests.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their events"
  ON event_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_requests
      WHERE event_requests.id = event_files.event_request_id
      AND event_requests.organizer_id = auth.uid()
    )
  );

-- RLS Policies for event_inquiries
CREATE POLICY "Organizers can view inquiries for their events"
  ON event_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_requests
      WHERE event_requests.id = event_inquiries.event_request_id
      AND event_requests.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view inquiries sent to them"
  ON event_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = event_inquiries.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert inquiries"
  ON event_inquiries FOR INSERT
  WITH CHECK (true);

-- RLS Policies for event_selected_partners
CREATE POLICY "Users can view selected partners for their events"
  ON event_selected_partners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_requests
      WHERE event_requests.id = event_selected_partners.event_request_id
      AND event_requests.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage selected partners for their events"
  ON event_selected_partners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM event_requests
      WHERE event_requests.id = event_selected_partners.event_request_id
      AND event_requests.organizer_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_requests_updated_at BEFORE UPDATE ON event_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_inquiries_updated_at BEFORE UPDATE ON event_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

