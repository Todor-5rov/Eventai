export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      partners: {
        Row: Partner;
        Insert: Omit<Partner, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Partner, 'id' | 'created_at'>>;
      };
      event_requests: {
        Row: EventRequest;
        Insert: Omit<EventRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventRequest, 'id' | 'created_at'>>;
      };
      event_files: {
        Row: EventFile;
        Insert: Omit<EventFile, 'id' | 'created_at'>;
        Update: Partial<Omit<EventFile, 'id'>>;
      };
      event_inquiries: {
        Row: EventInquiry;
        Insert: Omit<EventInquiry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventInquiry, 'id' | 'created_at'>>;
      };
      event_selected_partners: {
        Row: EventSelectedPartner;
        Insert: Omit<EventSelectedPartner, 'id' | 'created_at'>;
        Update: Partial<Omit<EventSelectedPartner, 'id'>>;
      };
    };
  };
}

export interface Profile {
  id: string;
  user_type: 'organizer' | 'partner';
  full_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  service_type: ServiceType;
  city: string;
  contact_name: string;
  contact_email: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRequest {
  id: string;
  organizer_id: string;
  event_name: string;
  event_type: string;
  attendees: number;
  event_date: string;
  budget: number | null;
  city: string;
  needs_catering: boolean;
  needs_merchandise: boolean;
  needs_sponsors: boolean;
  additional_notes: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface EventFile {
  id: string;
  event_request_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface EventInquiry {
  id: string;
  event_request_id: string;
  partner_id: string;
  email_content: string;
  email_subject: string;
  sent_at: string;
  status: InquiryStatus;
  gmail_message_id: string | null;
  has_attachment: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventSelectedPartner {
  id: string;
  event_request_id: string;
  partner_id: string;
  service_type: string;
  created_at: string;
}

export type ServiceType = 'venue' | 'catering' | 'merchandise' | 'sponsor' | 'other';
export type EventStatus = 'draft' | 'sent' | 'completed' | 'cancelled';
export type InquiryStatus = 'sent' | 'opened' | 'replied' | 'declined';

export interface PartnerWithDetails extends Partner {
  profiles?: Profile;
}

export interface EventWithDetails extends EventRequest {
  event_files?: EventFile[];
  event_selected_partners?: (EventSelectedPartner & {
    partners?: Partner;
  })[];
  event_inquiries?: (EventInquiry & {
    partners?: Partner;
  })[];
}

