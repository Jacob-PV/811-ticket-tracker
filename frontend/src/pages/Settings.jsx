/**
 * Settings page (placeholder)
 */

import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-6">
            <SettingsIcon className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Settings
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-2">
            Settings page coming soon!
          </p>
          <p className="text-sm text-gray-600">
            We're working on bringing you user management, notification preferences, and system configuration options.
          </p>
        </div>

        <div className="text-left bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Planned Features:
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>User management (add, edit, deactivate users)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Email notification preferences</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>State-specific expiration rule configuration</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>System defaults and preferences</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Account settings and profile management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
