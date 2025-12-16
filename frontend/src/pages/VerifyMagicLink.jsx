/**
 * Magic link verification page
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Alert from '../components/Common/Alert';

export default function VerifyMagicLink() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useAuth();
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No token provided');
      setVerifying(false);
      return;
    }

    handleVerify(token);
  }, [searchParams]);

  const handleVerify = async (token) => {
    try {
      await verifyMagicLink(token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired magic link');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Verifying your login...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert type="error">
            <h3 className="font-semibold mb-2">Verification Failed</h3>
            <p>{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 text-sm font-medium underline"
            >
              Back to login
            </button>
          </Alert>
        </div>
      </div>
    );
  }

  return null;
}
