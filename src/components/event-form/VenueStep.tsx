import { useEffect, useState } from 'react';
import { EventFormData } from '@/app/dashboard/organizer/create-event/page';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';

interface VenueStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VenueStep({ formData, updateFormData, onNext, onBack }: VenueStepProps) {
  const [venues, setVenues] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('service_type', 'venue')
        .eq('city', formData.city);

      if (data) {
        setVenues(data);
      }
      setIsLoading(false);
    }

    if (formData.city) {
      loadVenues();
    }
  }, [formData.city]);

  function toggleVenue(venueId: string) {
    const selected = formData.selectedVenues.includes(venueId);
    if (selected) {
      updateFormData({
        selectedVenues: formData.selectedVenues.filter(id => id !== venueId)
      });
    } else {
      updateFormData({
        selectedVenues: [...formData.selectedVenues, venueId]
      });
    }
  }

  function handleNext() {
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Venues</h2>
        <p className="text-gray-600">
          Choose venues in {formData.city} to contact
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading venues...</div>
      ) : venues.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No venues found in {formData.city}. You can skip this step and add venues later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {venues.map((venue) => (
            <label
              key={venue.id}
              className={`
                flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${formData.selectedVenues.includes(venue.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <input
                type="checkbox"
                checked={formData.selectedVenues.includes(venue.id)}
                onChange={() => toggleVenue(venue.id)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{venue.company_name}</h3>
                {venue.description && (
                  <p className="text-sm text-gray-600 mt-1">{venue.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Contact: {venue.contact_name} ({venue.contact_email})
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Catering
        </button>
      </div>
    </div>
  );
}

