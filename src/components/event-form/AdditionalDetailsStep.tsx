import { EventFormData } from '@/app/dashboard/organizer/create-event/page';

interface AdditionalDetailsStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AdditionalDetailsStep({ formData, updateFormData, onNext, onBack }: AdditionalDetailsStepProps) {
  function handleNext() {
    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
        <p className="text-gray-600">
          Add any additional information you'd like partners to know
        </p>
      </div>

      <div>
        <label className="label">Additional Notes (Optional)</label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
          className="input"
          rows={6}
          placeholder="Tell partners more about your event, special requirements, preferences, etc."
        />
        <p className="text-xs text-gray-500 mt-1">
          This information will be included in the inquiry emails sent to partners
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Review your event details and selected partners</li>
          <li>• Our AI will generate personalized inquiry emails</li>
          <li>• You can preview and edit emails before sending</li>
          <li>• Emails will be sent to all selected partners</li>
          <li>• Partners will reply directly to your email address</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Review & Send
        </button>
      </div>
    </div>
  );
}

