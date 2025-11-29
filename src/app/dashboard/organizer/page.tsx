'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { EventWithDetails, Profile } from '@/types/database';
import { format } from 'date-fns';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<EventWithDetails[]>([]);
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
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        
        // Load events
        const { data: eventsData } = await supabase
          .from('event_requests')
          .select(`
            *,
            event_inquiries (
              id,
              status,
              partners (
                company_name,
                service_type
              )
            )
          `)
          .eq('organizer_id', user.id)
          .order('created_at', { ascending: false });

        if (eventsData) {
          setEvents(eventsData as EventWithDetails[]);
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
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
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
      <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name}!
          </h1>
          <p className="text-gray-600">
            Manage your event requests and track responses from partners
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Event Requests</h2>
          <Link 
            href="/dashboard/organizer/create-event" 
            className="btn btn-primary"
          >
            + Create New Event Request
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No event requests yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first event request to start connecting with partners
            </p>
            <Link 
              href="/dashboard/organizer/create-event" 
              className="btn btn-primary inline-block"
            >
              Create Event Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{event.event_name}</h3>
                    <p className="text-gray-600">{event.event_type}</p>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">
                      {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Attendees:</span>
                    <p className="font-medium">{event.attendees}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span>
                    <p className="font-medium">{event.city}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <p className="font-medium">
                      {event.budget ? `$${event.budget.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {event.event_inquiries && event.event_inquiries.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Contacted {event.event_inquiries.length} partner(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.event_inquiries.slice(0, 5).map((inquiry) => (
                        <span 
                          key={inquiry.id}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                        >
                          {inquiry.partners?.company_name}
                        </span>
                      ))}
                      {event.event_inquiries.length > 5 && (
                        <span className="text-xs px-2 py-1 text-gray-600">
                          +{event.event_inquiries.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/organizer/event/${event.id}`}
                    className="btn btn-secondary text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

