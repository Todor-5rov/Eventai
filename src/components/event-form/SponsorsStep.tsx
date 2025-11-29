import { useEffect, useState } from 'react';
import { EventFormData } from '@/app/dashboard/organizer/create-event/page';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';

interface SponsorsStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SponsorsStep({ formData, updateFormData, onNext, onBack }: SponsorsStepProps) {
  const [sponsors, setSponsors] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSponsors() {
      if (formData.needsSponsors) {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('service_type', 'sponsor')
          .eq('city', formData.city);

        if (data) {
          setSponsors(data);
        }
      }
      setIsLoading(false);
    }

    loadSponsors();
  }, [formData.city, formData.needsSponsors]);

  function toggleSponsor(sponsorId: string) {
    const selected = formData.selectedSponsors.includes(sponsorId);
    if (selected) {
      updateFormData({
        selectedSponsors: formData.selectedSponsors.filter(id => id !== sponsorId)
      });
    } else {
      updateFormData({
        selectedSponsors: [...formData.selectedSponsors, sponsorId]
      });
    }
  }

  function handleNext() {
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sponsors</h2>
        <p className="text-gray-600">Are you looking for sponsors?</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsSponsors === false}
            onChange={() => updateFormData({ needsSponsors: false, selectedSponsors: [] })}
            className="mr-2"
          />
          <span>No, I don't need sponsors</span>
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsSponsors === true}
            onChange={() => updateFormData({ needsSponsors: true })}
            className="mr-2"
          />
          <span>Yes, I'm looking for sponsors</span>
        </label>
      </div>

      {formData.needsSponsors && (
        <>
          {isLoading ? (
            <div className="text-center py-8">Loading sponsors...</div>
          ) : sponsors.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No sponsors found in {formData.city}.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <p className="font-medium">Select potential sponsors:</p>
              {sponsors.map((sponsor) => (
                <label
                  key={sponsor.id}
                  className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
                    ${formData.selectedSponsors.includes(sponsor.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedSponsors.includes(sponsor.id)}
                    onChange={() => toggleSponsor(sponsor.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{sponsor.company_name}</h3>
                    {sponsor.description && (
                      <p className="text-sm text-gray-600 mt-1">{sponsor.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contact: {sponsor.contact_name} ({sponsor.contact_email})
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Additional Details
        </button>
      </div>
    </div>
  );
}

