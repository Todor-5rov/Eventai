import { EventFormData } from '@/app/dashboard/organizer/create-event/page';

interface EventBasicsStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
}

export function EventBasicsStep({ formData, updateFormData, onNext }: EventBasicsStepProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Event Basics</h2>

      <div>
        <label className="label">Event Name *</label>
        <input
          type="text"
          value={formData.eventName}
          onChange={(e) => updateFormData({ eventName: e.target.value })}
          className="input"
          required
          placeholder="Annual Company Conference"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Event Type *</label>
          <select
            value={formData.eventType}
            onChange={(e) => updateFormData({ eventType: e.target.value })}
            className="input"
            required
          >
            <option value="">Select type...</option>
            <option value="Conference">Conference</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Seminar">Seminar</option>
            <option value="Workshop">Workshop</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="label">Number of Attendees *</label>
          <input
            type="number"
            value={formData.attendees || ''}
            onChange={(e) => updateFormData({ attendees: parseInt(e.target.value) || 0 })}
            className="input"
            required
            min="1"
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Event Date *</label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => updateFormData({ eventDate: e.target.value })}
            className="input"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="label">Budget (Optional)</label>
          <input
            type="number"
            value={formData.budget || ''}
            onChange={(e) => updateFormData({ budget: parseInt(e.target.value) || 0 })}
            className="input"
            placeholder="5000"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="label">City *</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => updateFormData({ city: e.target.value })}
          className="input"
          required
          placeholder="Sofia"
        />
        <p className="text-xs text-gray-500 mt-1">
          We'll show you partners available in this city
        </p>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Next: Select Venue
        </button>
      </div>
    </form>
  );
}

