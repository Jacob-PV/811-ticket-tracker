/**
 * Ticket card component for list view
 */

import { FileText, MapPin, Calendar, User, Edit, RefreshCw } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getExpirationStatus, getStatusText } from '../../utils/expirationUtils';
import Button from '../Common/Button';

export default function TicketCard({ ticket, onEdit, onRenew }) {
  const { colorClass, badgeClass, textColorClass } = getExpirationStatus(ticket.expiration_date);
  const statusText = getStatusText(ticket.expiration_date);

  return (
    <div className={`rounded-lg border p-4 ${colorClass} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold font-mono">{ticket.ticket_number}</h3>
          <p className="text-base font-semibold mt-1">{ticket.job_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
          {statusText}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{ticket.address}</span>
        </div>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Expires: {formatDate(ticket.expiration_date)}</span>
        </div>

        {ticket.assigned_pm && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{ticket.assigned_pm}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(ticket)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          View/Edit
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRenew(ticket)}
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Renew
        </Button>
      </div>
    </div>
  );
}
