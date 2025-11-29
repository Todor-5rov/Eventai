import { useEffect, useState } from 'react';
import { EventFormData } from '@/app/dashboard/organizer/create-event/page';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';

interface CateringStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CateringStep({ formData, updateFormData, onNext, onBack }: CateringStepProps) {
  const [caterers, setCaterers] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCaterers() {
      if (formData.needsCatering) {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('service_type', 'catering')
          .eq('city', formData.city);

        if (data) {
          setCaterers(data);
        }
      }
      setIsLoading(false);
    }

    loadCaterers();
  }, [formData.city, formData.needsCatering]);

  function toggleCaterer(catererId: string) {
    const selected = formData.selectedCatering.includes(catererId);
    if (selected) {
      updateFormData({
        selectedCatering: formData.selectedCatering.filter(id => id !== catererId)
      });
    } else {
      updateFormData({
        selectedCatering: [...formData.selectedCatering, catererId]
      });
    }
  }

  function handleNext() {
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Catering Services</h2>
        <p className="text-gray-600">Do you need catering for your event?</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsCatering === false}
            onChange={() => updateFormData({ needsCatering: false, selectedCatering: [] })}
            className="mr-2"
          />
          <span>No, I don't need catering</span>
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsCatering === true}
            onChange={() => updateFormData({ needsCatering: true })}
            className="mr-2"
          />
          <span>Yes, I need catering</span>
        </label>
      </div>

      {formData.needsCatering && (
        <>
          {isLoading ? (
            <div className="text-center py-8">Loading caterers...</div>
          ) : caterers.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No catering companies found in {formData.city}.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <p className="font-medium">Select catering companies:</p>
              {caterers.map((caterer) => (
                <label
                  key={caterer.id}
                  className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
                    ${formData.selectedCatering.includes(caterer.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedCatering.includes(caterer.id)}
                    onChange={() => toggleCaterer(caterer.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{caterer.company_name}</h3>
                    {caterer.description && (
                      <p className="text-sm text-gray-600 mt-1">{caterer.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contact: {caterer.contact_name} ({caterer.contact_email})
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
          Next: Merchandise
        </button>
      </div>
    </div>
  );
}

