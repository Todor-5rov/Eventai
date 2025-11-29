import { EventFormData } from '@/app/dashboard/organizer/create-event/page';
import { format } from 'date-fns';

interface ReviewStepProps {
  formData: EventFormData;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ReviewStep({ formData, onBack, onSubmit, isLoading }: ReviewStepProps) {
  const totalPartners = 
    formData.selectedVenues.length +
    formData.selectedCatering.length +
    formData.selectedMerchandise.length +
    formData.selectedSponsors.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Event Request</h2>
        <p className="text-gray-600">
          Please review all details before sending inquiries
        </p>
      </div>

      {/* Event Details */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Event Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Event Name:</span>
            <p className="font-medium">{formData.eventName}</p>
          </div>
          <div>
            <span className="text-gray-600">Event Type:</span>
            <p className="font-medium">{formData.eventType}</p>
          </div>
          <div>
            <span className="text-gray-600">Date:</span>
            <p className="font-medium">
              {format(new Date(formData.eventDate), 'MMMM dd, yyyy')}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Attendees:</span>
            <p className="font-medium">{formData.attendees}</p>
          </div>
          <div>
            <span className="text-gray-600">City:</span>
            <p className="font-medium">{formData.city}</p>
          </div>
          <div>
            <span className="text-gray-600">Budget:</span>
            <p className="font-medium">
              {formData.budget ? `$${formData.budget.toLocaleString()}` : 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Services Requested */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Services Requested</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={formData.selectedVenues.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {formData.selectedVenues.length > 0 ? '✓' : '○'}
            </span>
            <span>Venue ({formData.selectedVenues.length} selected)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={formData.needsCatering ? 'text-green-600' : 'text-gray-400'}>
              {formData.needsCatering ? '✓' : '○'}
            </span>
            <span>Catering ({formData.selectedCatering.length} selected)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={formData.needsMerchandise ? 'text-green-600' : 'text-gray-400'}>
              {formData.needsMerchandise ? '✓' : '○'}
            </span>
            <span>Merchandise ({formData.selectedMerchandise.length} selected)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={formData.needsSponsors ? 'text-green-600' : 'text-gray-400'}>
              {formData.needsSponsors ? '✓' : '○'}
            </span>
            <span>Sponsors ({formData.selectedSponsors.length} selected)</span>
          </div>
        </div>
      </div>

      {/* Files */}
      {formData.files.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Attached Files</h3>
          <div className="space-y-2">
            {formData.files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span>📄</span>
                <span>{file.name}</span>
                <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {formData.additionalNotes && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Additional Notes</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {formData.additionalNotes}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h3 className="font-semibold text-primary-900 mb-2">Ready to Send</h3>
        <p className="text-sm text-primary-800">
          You're about to send inquiries to <strong>{totalPartners}</strong> partner(s).
          Our AI will generate personalized emails for each partner based on your event details.
        </p>
      </div>

      {totalPartners === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ You haven't selected any partners. Please go back and select at least one partner to contact.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || totalPartners === 0}
          className="btn btn-primary"
        >
          {isLoading ? 'Creating request...' : 'Create & Continue'}
        </button>
      </div>
    </div>
  );
}

