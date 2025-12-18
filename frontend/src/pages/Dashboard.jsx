/**
 * Dashboard page with stats overview
 */

import { Link } from 'react-router-dom';
import { useTicketStats } from '../hooks/useTickets';
import { AlertCircle, Clock, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';

export default function Dashboard() {
  const { data: stats, isLoading } = useTicketStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Expired',
      value: stats?.expired_tickets || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/tickets?status=expired',
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiring_soon_tickets || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/tickets?status=expiring_soon',
    },
    {
      title: 'Active',
      value: stats?.active_tickets || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/tickets?status=active',
    },
    {
      title: 'Total Tickets',
      value: stats?.total_tickets || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/tickets',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/tickets?create=true">
          <Button variant="primary">
            + New Ticket
          </Button>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.bgColor} rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">By State</h3>
              <div className="space-y-1">
                {Object.entries(stats.tickets_by_state || {}).map(([state, count]) => (
                  <div key={state} className="flex justify-between text-sm">
                    <span className="text-gray-700">{state}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Expiring Soon</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.expiring_in_next_7_days || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">in the next 7 days</p>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Attention */}
      {stats && (stats.expired_tickets > 0 || stats.expiring_soon_tickets > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Urgent Attention Needed
              </h2>
              <p className="text-red-800 mb-4">
                You have {stats.expired_tickets} expired ticket{stats.expired_tickets !== 1 ? 's' : ''} and{' '}
                {stats.expiring_soon_tickets} ticket{stats.expiring_soon_tickets !== 1 ? 's' : ''} expiring soon.
              </p>
              <Link to="/tickets?status=expired">
                <Button variant="danger" size="sm">
                  View Urgent Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
