/**
 * Ticket create/edit form
 */

import { useState } from 'react';
import { formatDateForInput } from '../../utils/dateUtils';
import { US_STATES } from '../../lib/constants';
import Button from '../Common/Button';
import Input from '../Common/Input';

export default function TicketForm({ ticket = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    ticket_number: ticket?.ticket_number || '',
    job_name: ticket?.job_name || '',
    address: ticket?.address || '',
    state: ticket?.state || 'VA',
    submit_date: ticket?.submit_date ? formatDateForInput(ticket.submit_date) : formatDateForInput(new Date()),
    expiration_date: ticket?.expiration_date ? formatDateForInput(ticket.expiration_date) : '',
    utility_responses: ticket?.utility_responses || '',
    assigned_pm: ticket?.assigned_pm || '',
    notes: ticket?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ticket Number"
          name="ticket_number"
          value={formData.ticket_number}
          onChange={handleChange}
          required
          placeholder="VA-2025-0123"
          helperText="Unique ticket identifier"
          disabled={!!ticket}
        />

        <Input
          label="Job/Site Name"
          name="job_name"
          value={formData.job_name}
          onChange={handleChange}
          required
          placeholder="Main Street Fiber Install"
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        placeholder="123 Main St, Richmond, VA 23220"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 min-h-[48px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {US_STATES.map(state => (
              <option key={state.code} value={state.code}>
                {state.name} ({state.code})
              </option>
            ))}
          </select>
        </div>

        <Input
          type="date"
          label="Submit Date"
          name="submit_date"
          value={formData.submit_date}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        type="date"
        label="Expiration Date"
        name="expiration_date"
        value={formData.expiration_date}
        onChange={handleChange}
        helperText="Leave blank to auto-calculate based on state rules"
      />

      <Input
        label="Assigned Project Manager"
        name="assigned_pm"
        value={formData.assigned_pm}
        onChange={handleChange}
        placeholder="email@company.com"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Utility Responses
        </label>
        <textarea
          name="utility_responses"
          value={formData.utility_responses}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Dominion clearance received..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="High priority - start dig Monday..."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {ticket ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
}
