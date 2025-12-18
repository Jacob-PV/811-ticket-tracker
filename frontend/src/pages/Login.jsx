/**
 * Login page
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';

export default function Login() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-2">
              811 Ticket Tracker
            </h1>
            <p className="text-gray-600">
              Never miss a ticket expiration
            </p>
            <p className="text-xs text-gray-500 mt-4 italic">
              Independent beta product. Feedback does not create ownership, partnership, or work-for-hire relationships.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
