'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Partner, ServiceType } from '@/types/database';
import { EventBasicsStep } from '@/components/event-form/EventBasicsStep';
import { VenueStep } from '@/components/event-form/VenueStep';
import { CateringStep } from '@/components/event-form/CateringStep';
import { MerchandiseStep } from '@/components/event-form/MerchandiseStep';
import { SponsorsStep } from '@/components/event-form/SponsorsStep';
import { AdditionalDetailsStep } from '@/components/event-form/AdditionalDetailsStep';
import { ReviewStep } from '@/components/event-form/ReviewStep';

export interface EventFormData {
  eventName: string;
  eventType: string;
  attendees: number;
  eventDate: string;
  budget: number;
  city: string;
  needsCatering: boolean;
  needsMerchandise: boolean;
  needsSponsors: boolean;
  additionalNotes: string;
  selectedVenues: string[];
  selectedCatering: string[];
  selectedMerchandise: string[];
  selectedSponsors: string[];
  files: Array<{
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
}

const initialFormData: EventFormData = {
  eventName: '',
  eventType: '',
  attendees: 0,
  eventDate: '',
  budget: 0,
  city: '',
  needsCatering: false,
  needsMerchandise: false,
  needsSponsors: false,
  additionalNotes: '',
  selectedVenues: [],
  selectedCatering: [],
  selectedMerchandise: [],
  selectedSponsors: [],
  files: [],
};

const steps = [
  'Event Basics',
  'Venue',
  'Catering',
  'Merchandise',
  'Sponsors',
  'Additional Details',
  'Review',
];

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);
    }
    checkAuth();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function updateFormData(updates: Partial<EventFormData>) {
    setFormData({ ...formData, ...updates });
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      // Create event request
      const { data: eventData, error: eventError } = await supabase
        .from('event_requests')
        .insert({
          organizer_id: userId,
          event_name: formData.eventName,
          event_type: formData.eventType,
          attendees: formData.attendees,
          event_date: formData.eventDate,
          budget: formData.budget || null,
          city: formData.city,
          needs_catering: formData.needsCatering,
          needs_merchandise: formData.needsMerchandise,
          needs_sponsors: formData.needsSponsors,
          additional_notes: formData.additionalNotes || null,
          status: 'draft',
        })
        .select()
        .single();

      if (eventError || !eventData) throw eventError || new Error('Failed to create event');
      
      const event = eventData as any;

      // Add files if any
      if (formData.files.length > 0) {
        const fileInserts = formData.files.map(file => ({
          event_request_id: event.id,
          file_name: file.name,
          file_url: file.url,
          file_size: file.size,
          mime_type: file.mimeType,
        }));

        const { error: filesError } = await supabase
          .from('event_files')
          .insert(fileInserts);

        if (filesError) throw filesError;
      }

      // Add selected partners
      const allSelectedPartners = [
        ...formData.selectedVenues.map(id => ({ partner_id: id, service_type: 'venue' })),
        ...formData.selectedCatering.map(id => ({ partner_id: id, service_type: 'catering' })),
        ...formData.selectedMerchandise.map(id => ({ partner_id: id, service_type: 'merchandise' })),
        ...formData.selectedSponsors.map(id => ({ partner_id: id, service_type: 'sponsor' })),
      ];

      if (allSelectedPartners.length > 0) {
        const partnerInserts = allSelectedPartners.map(p => ({
          event_request_id: event.id,
          partner_id: p.partner_id,
          service_type: p.service_type,
        }));

        const { error: partnersError } = await supabase
          .from('event_selected_partners')
          .insert(partnerInserts);

        if (partnersError) throw partnersError;
      }

      // Redirect to confirmation page
      router.push(`/dashboard/organizer/event/${event.id}/send`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated userType="organizer" onSignOut={handleSignOut} />
      
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Create Event Request</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex-1">
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-1 mx-2
                      ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
                <p className="text-xs mt-1 hidden sm:block">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {currentStep === 0 && (
            <EventBasicsStep 
              formData={formData} 
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 1 && (
            <VenueStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <CateringStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <MerchandiseStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <SponsorsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <AdditionalDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
            <ReviewStep
              formData={formData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

