'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { EventInquiry, Profile, Partner, EventRequest } from '@/types/database';
import { format } from 'date-fns';

interface InquiryWithDetails extends EventInquiry {
  event_requests?: EventRequest;
  organizer_profile?: Profile;
}

export default function PartnerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [inquiries, setInquiries] = useState<InquiryWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        
        // Load partner details
        const { data: partnerData } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (partnerData) {
          setPartner(partnerData);
          
          // Load inquiries for this partner
          const { data: inquiriesData } = await supabase
            .from('event_inquiries')
            .select(`
              *,
              event_requests (
                event_name,
                event_type,
                event_date,
                attendees,
                city,
                organizer_id
              )
            `)
            .eq('partner_id', partnerData.id)
            .order('sent_at', { ascending: false });

          if (inquiriesData) {
            // Get organizer profiles
            const organizerIds = inquiriesData
              .map((inq: any) => inq.event_requests?.organizer_id)
              .filter(Boolean);

            const { data: organizersData } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', organizerIds);

            const inquiriesWithOrganizers = inquiriesData.map((inq: any) => ({
              ...inq,
              organizer_profile: organizersData?.find(
                (org) => org.id === inq.event_requests?.organizer_id
              ),
            }));

            setInquiries(inquiriesWithOrganizers);
          }
        }
      }

      setIsLoading(false);
    }

    loadData();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      sent: 'bg-blue-100 text-blue-800',
      opened: 'bg-purple-100 text-purple-800',
      replied: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated userType="partner" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name}!
          </h1>
          <p className="text-gray-600">
            {partner?.company_name} • {partner?.service_type}
          </p>
        </div>

        {/* Partner Info Card */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Business Profile</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Company:</span>
              <p className="font-medium">{partner?.company_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Service Type:</span>
              <p className="font-medium capitalize">{partner?.service_type}</p>
            </div>
            <div>
              <span className="text-gray-600">City:</span>
              <p className="font-medium">{partner?.city}</p>
            </div>
            <div>
              <span className="text-gray-600">Contact:</span>
              <p className="font-medium">{partner?.contact_email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Event Inquiries</h2>
          <p className="text-gray-600 mt-1">
            Inquiries you've received from event organizers
          </p>
        </div>

        {inquiries.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold mb-2">No inquiries yet</h3>
            <p className="text-gray-600">
              When organizers are planning events in {partner?.city}, you'll receive inquiries here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {inquiry.event_requests?.event_name}
                    </h3>
                    <p className="text-gray-600">
                      {inquiry.event_requests?.event_type}
                    </p>
                  </div>
                  {getStatusBadge(inquiry.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">
                      {inquiry.event_requests?.event_date &&
                        format(new Date(inquiry.event_requests.event_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Attendees:</span>
                    <p className="font-medium">{inquiry.event_requests?.attendees}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span>
                    <p className="font-medium">{inquiry.event_requests?.city}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Received:</span>
                    <p className="font-medium">
                      {format(new Date(inquiry.sent_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {inquiry.organizer_profile && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-600">
                      Organizer: <span className="font-medium">{inquiry.organizer_profile.full_name}</span>
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">Email Subject:</h4>
                  <p className="text-sm text-gray-700 mb-3">{inquiry.email_subject}</p>
                  
                  <h4 className="font-semibold text-sm mb-2">Message:</h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {inquiry.email_content}
                  </div>
                </div>

                {inquiry.has_attachment && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                      📎 This inquiry includes file attachments
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <a
                    href={`mailto:${inquiry.organizer_profile?.full_name}`}
                    className="btn btn-primary text-sm"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

