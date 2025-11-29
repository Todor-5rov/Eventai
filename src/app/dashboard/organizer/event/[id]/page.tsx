'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { EventWithDetails } from '@/types/database';
import { format } from 'date-fns';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: eventData } = await supabase
        .from('event_requests')
        .select(`
          *,
          event_files (*),
          event_inquiries (
            id,
            status,
            sent_at,
            has_attachment,
            partners (
              company_name,
              service_type,
              contact_email
            )
          )
        `)
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single();

      if (eventData) {
        setEvent(eventData as EventWithDetails);
      }

      setIsLoading(false);
    }

    loadData();
  }, [eventId, router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
            <Link href="/dashboard/organizer" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Link
          href="/dashboard/organizer"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="card mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.event_name}</h1>
              <p className="text-gray-600">{event.event_type}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              event.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-sm text-gray-500">Date</span>
              <p className="font-medium">{format(new Date(event.event_date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Attendees</span>
              <p className="font-medium">{event.attendees}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">City</span>
              <p className="font-medium">{event.city}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Budget</span>
              <p className="font-medium">
                {event.budget ? `$${event.budget.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created</span>
              <p className="font-medium">{format(new Date(event.created_at), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          {event.additional_notes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{event.additional_notes}</p>
            </div>
          )}
        </div>

        {event.event_files && event.event_files.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Attached Files</h2>
            <div className="space-y-2">
              {event.event_files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span className="font-medium">{file.file_name}</span>
                    <span className="text-sm text-gray-500">
                      ({(file.file_size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.event_inquiries && event.event_inquiries.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Contacted Partners</h2>
            <div className="space-y-3">
              {event.event_inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{inquiry.partners?.company_name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {inquiry.partners?.service_type}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      inquiry.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'replied' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Sent: {format(new Date(inquiry.sent_at), 'MMM dd, yyyy HH:mm')}
                    {inquiry.has_attachment && ' • With attachments'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

