'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { EventWithDetails } from '@/types/database';

export default function ConfirmationPage() {
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

      // Load event with inquiries
      const { data: eventData } = await supabase
        .from('event_requests')
        .select(`
          *,
          event_inquiries (
            id,
            status,
            has_attachment,
            partners (
              company_name,
              service_type
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
            <button onClick={() => router.push('/dashboard/organizer')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inquiries = event.event_inquiries || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold mb-2 text-green-600">
            Your Requests Have Been Sent!
          </h1>
          <p className="text-lg text-gray-600">
            We've contacted {inquiries.length} partner(s) on your behalf
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="font-semibold mb-1">Partners Will Receive Your Inquiry</h3>
                <p className="text-gray-600 text-sm">
                  Each partner will receive a personalized email about your event
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">↩️</div>
              <div>
                <h3 className="font-semibold mb-1">They'll Reply Directly to You</h3>
                <p className="text-gray-600 text-sm">
                  Responses will come straight to your email inbox - no middleman!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl">🤝</div>
              <div>
                <h3 className="font-semibold mb-1">Compare & Choose</h3>
                <p className="text-gray-600 text-sm">
                  Review proposals and select the best partners for your event
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Contacted Partners</h2>
          <div className="space-y-2">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✉️</span>
                  <div>
                    <p className="font-medium">{inquiry.partners?.company_name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {inquiry.partners?.service_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {inquiry.has_attachment && (
                    <span className="text-xs text-gray-500">📎 with files</span>
                  )}
                  <span className="text-green-600 font-medium text-sm">Sent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard/organizer"
            className="btn btn-primary"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/organizer/create-event"
            className="btn btn-secondary"
          >
            Create Another Event
          </Link>
        </div>
      </div>
    </div>
  );
}

