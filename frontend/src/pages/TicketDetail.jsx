/**
 * Ticket detail/edit page
 */

import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTicket, useTickets } from '../hooks/useTickets';
import { useAuth } from '../hooks/useAuth';
import { tickets as ticketsAPI } from '../lib/api';
import { formatDate } from '../utils/dateUtils';
import TicketForm from '../components/Tickets/TicketForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import { ArrowLeft, Trash2, X } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ticket, isLoading, error } = useTicket(id);
  const { deleteTicket } = useTickets();

  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleUpdate = async (formData) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      await ticketsAPI.update(id, formData);
      navigate('/tickets', {
        state: { message: 'Ticket updated successfully!' }
      });
    } catch (err) {
      setSaveError(err.message);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket.mutateAsync(id);
      navigate('/tickets', {
        state: { message: 'Ticket deleted successfully!' }
      });
    } catch (err) {
      alert('Failed to delete ticket: ' + err.message);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert type="error" className="mb-4">
          {error?.message || 'Ticket not found'}
        </Alert>
        <Link to="/tickets">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/tickets">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit Ticket
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Ticket #{ticket.ticket_number}
            </p>
          </div>
        </div>

        {isAdmin && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Ticket
          </Button>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 font-medium">
              {formatDate(ticket.created_at)}
            </span>
          </div>
          {ticket.updated_at && (
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <span className="ml-2 font-medium">
                {formatDate(ticket.updated_at)}
              </span>
            </div>
          )}
          {ticket.created_by && (
            <div>
              <span className="text-gray-600">Created By:</span>
              <span className="ml-2 font-medium">
                {ticket.created_by.full_name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {saveError && (
        <Alert type="error" onClose={() => setSaveError(null)}>
          {saveError}
        </Alert>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <TicketForm
          ticket={ticket}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/tickets')}
          loading={isSaving}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Delete Ticket
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={deleteTicket.isPending}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Alert type="error" className="mb-4">
              This action cannot be undone!
            </Alert>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this ticket?
              </p>
              <div className="bg-gray-50 rounded p-4 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Ticket Number:</span>{' '}
                  {ticket.ticket_number}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Job Name:</span>{' '}
                  {ticket.job_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Address:</span>{' '}
                  {ticket.address}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteTicket.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleteTicket.isPending}
                className="flex-1"
              >
                Delete Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
