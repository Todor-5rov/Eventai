'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { EventWithDetails, Partner } from '@/types/database';

interface EmailPreview {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  subject: string;
  content: string;
  hasAttachment: boolean;
}

export default function SendEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [emailPreviews, setEmailPreviews] = useState<EmailPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Load event with partners
      const { data: eventData } = await supabase
        .from('event_requests')
        .select(`
          *,
          event_files (*),
          event_selected_partners (
            id,
            service_type,
            partners (*)
          )
        `)
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single();

      if (eventData) {
        setEvent(eventData as EventWithDetails);
        
        // Generate email previews
        await generateEmailPreviews(eventData as EventWithDetails, user);
      }

      setIsLoading(false);
    }

    loadData();
  }, [eventId, router]);

  async function generateEmailPreviews(eventData: EventWithDetails, user: any) {
    const selectedPartners = eventData.event_selected_partners || [];
    
    if (selectedPartners.length === 0) {
      return;
    }

    const previews: EmailPreview[] = [];

    for (const sp of selectedPartners) {
      if (!sp.partners) continue;

      const partner = sp.partners as unknown as Partner;
      
      // Generate email using API route
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventData,
          partner,
          serviceType: sp.service_type,
        }),
      });

      if (response.ok) {
        const { subject, content } = await response.json();
        previews.push({
          partnerId: partner.id,
          partnerName: partner.company_name,
          partnerEmail: partner.contact_email,
          subject,
          content,
          hasAttachment: sp.service_type === 'merchandise' && (eventData.event_files?.length || 0) > 0,
        });
      }
    }

    setEmailPreviews(previews);
  }

  async function handleSendEmails() {
    if (!event) return;

    setIsSending(true);
    setSendError('');

    try {
      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          emailPreviews,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send emails');
      }

      // Update event status
      await supabase
        .from('event_requests')
        .update({ status: 'sent' } as any)
        .eq('id', event.id);

      setSendSuccess(true);
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/organizer/event/${event.id}/confirmation`);
      }, 2000);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send emails');
    } finally {
      setIsSending(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Generating email previews...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Event not found</h1>
            <button onClick={() => router.push('/dashboard/organizer')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-2">Review & Send Emails</h1>
        <p className="text-gray-600 mb-8">
          Preview the AI-generated emails before sending to {emailPreviews.length} partner(s)
        </p>

        {sendError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {sendError}
          </div>
        )}

        {sendSuccess && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
            ✓ Emails sent successfully! Redirecting...
          </div>
        )}

        <div className="space-y-6 mb-8">
          {emailPreviews.map((preview, index) => (
            <div key={preview.partnerId} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{preview.partnerName}</h3>
                  <p className="text-sm text-gray-600">{preview.partnerEmail}</p>
                </div>
                <span className="text-sm text-gray-500">Email {index + 1}</span>
              </div>

              <div className="border-t pt-4">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Subject:</label>
                  <p className="mt-1 text-gray-900">{preview.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <div className="mt-1 bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm text-gray-900">
                    {preview.content}
                  </div>
                </div>

                {preview.hasAttachment && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                      📎 This email will include {event.event_files?.length} file attachment(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard/organizer')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmails}
            disabled={isSending || emailPreviews.length === 0}
            className="btn btn-primary"
          >
            {isSending ? 'Sending...' : `Send All Emails (${emailPreviews.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

