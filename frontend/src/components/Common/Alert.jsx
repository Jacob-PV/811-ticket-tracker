/**
 * Alert component for notifications
 */

import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function Alert({ type = 'info', children, onClose, className = '' }) {
  const types = {
    success: {
      icon: CheckCircle,
      classes: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500',
    },
    warning: {
      icon: AlertTriangle,
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500',
    },
    error: {
      icon: XCircle,
      classes: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500',
    },
    info: {
      icon: Info,
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const { icon: Icon, classes, iconColor } = types[type];

  return (
    <div className={`border rounded-lg p-4 ${classes} ${className}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${iconColor} mr-3 mt-0.5`} />
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-current hover:opacity-70"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
