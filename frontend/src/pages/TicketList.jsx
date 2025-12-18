/**
 * Ticket list page with filtering
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { formatDateForInput } from '../utils/dateUtils';
import TicketCard from '../components/Tickets/TicketCard';
import TicketForm from '../components/Tickets/TicketForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import { Plus, X, Copy, ExternalLink } from 'lucide-react';

export default function TicketList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Auto-open create modal if URL has ?create=true
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      // Remove the parameter from URL
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [renewDate, setRenewDate] = useState('');

  const { tickets, isLoading, createTicket, renewTicket } = useTickets(filters);
  const navigate = useNavigate();

  const handleCreateTicket = async (formData) => {
    try {
      await createTicket.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRenew = (ticket) => {
    setSelectedTicket(ticket);
    setShowRenewModal(true);
    // Calculate suggested renewal date (30 days from now)
    const suggestedDate = new Date();
    suggestedDate.setDate(suggestedDate.getDate() + 30);
    setRenewDate(formatDateForInput(suggestedDate));
  };

  const handleRenewSubmit = async () => {
    if (!renewDate || !selectedTicket) return;

    try {
      await renewTicket.mutateAsync({
        id: selectedTicket.id,
        newExpirationDate: renewDate,
      });
      setShowRenewModal(false);
      setSelectedTicket(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCopyTicketInfo = (ticket) => {
    const ticketInfo = `Ticket Number: ${ticket.ticket_number}\nAddress: ${ticket.address}\nScope: ${ticket.job_name}`;
    navigator.clipboard.writeText(ticketInfo);
    alert('Ticket info copied to clipboard!');
  };

  const openPortal = (state) => {
    const portals = {
      VA: 'https://va811.com',
      MD: 'https://miss-utility.net',
      DC: 'https://dcwater.com/811',
    };
    window.open(portals[state] || portals.VA, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!filters.status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilters({})}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilters({ status: 'active' })}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'expiring_soon' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilters({ status: 'expiring_soon' })}
          >
            Expiring Soon
          </Button>
          <Button
            variant={filters.status === 'expired' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilters({ status: 'expired' })}
          >
            Expired
          </Button>
        </div>
      </div>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No tickets found</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create Your First Ticket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEdit={(t) => navigate(`/tickets/${t.id}`)}
              onRenew={handleRenew}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Ticket</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <TicketForm
              onSubmit={handleCreateTicket}
              onCancel={() => setShowCreateModal(false)}
              loading={createTicket.isPending}
            />
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {showRenewModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Renew Ticket</h2>
              <button
                onClick={() => setShowRenewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Alert type="success" className="mb-4">
              Ticket info ready to paste into 811 portal!
            </Alert>

            <div className="bg-gray-50 rounded p-4 mb-4 font-mono text-sm">
              <p>Ticket: {selectedTicket.ticket_number}</p>
              <p>Address: {selectedTicket.address}</p>
              <p>Scope: {selectedTicket.job_name}</p>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyTicketInfo(selectedTicket)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Info
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openPortal(selectedTicket.state)}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open {selectedTicket.state} 811
              </Button>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Expiration Date
              </label>
              <input
                type="date"
                value={renewDate}
                onChange={(e) => setRenewDate(e.target.value)}
                className="w-full max-w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 min-h-[48px] border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Suggested: 30 days from today
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowRenewModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRenewSubmit}
                loading={renewTicket.isPending}
                className="flex-1"
              >
                Save Renewal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
