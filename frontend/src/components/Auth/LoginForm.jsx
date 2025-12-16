/**
 * Login form with magic link
 */

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Alert from '../Common/Alert';

export default function LoginForm({ onSuccess }) {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      await login(email);
      setEmailSent(true);
      if (onSuccess) onSuccess(email);
    } catch (err) {
      setLocalError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <Alert type="success">
          <h3 className="font-semibold">Check your email!</h3>
          <p className="mt-1 text-sm">
            We sent a login link to <strong>{email}</strong>
          </p>
          <p className="mt-2 text-sm">
            The link will expire in 15 minutes.
          </p>
        </Alert>
        <p className="text-sm text-gray-600">
          Didn't receive it?{' '}
          <button
            onClick={() => setEmailSent(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Send another link
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Login
        </h2>
        <p className="text-gray-600">
          Enter your email to receive a magic link
        </p>
      </div>

      {(error || localError) && (
        <Alert type="error">
          {error || localError}
        </Alert>
      )}

      <Input
        type="email"
        label="Email Address"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
        autoComplete="email"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Send Magic Link
      </Button>

      <p className="text-xs text-gray-500 text-center">
        A passwordless login link will be sent to your email
      </p>
    </form>
  );
}
