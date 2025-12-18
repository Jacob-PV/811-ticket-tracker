/**
 * App header with navigation
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Two-row layout on mobile for better navigation */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:h-16">

          {/* Top row: Logo, Settings (mobile icon-only), User info, Logout */}
          <div className="flex justify-between items-center h-14 md:h-16 gap-2">
            {/* Logo and App Name */}
            <div className="flex items-center min-w-0 flex-shrink">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary-600 truncate">
                811 Ticket Tracker
              </h1>
            </div>

            {/* Right side: Settings (mobile icon-only) + User Menu + Logout */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-shrink">
              {/* Settings - Icon only on mobile, moves to nav on desktop */}
              {user?.role === 'admin' && (
                <Link
                  to="/settings"
                  className="md:hidden flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              )}

              {/* User info - hidden on small screens */}
              <div className="hidden lg:block text-sm text-gray-700 min-w-0">
                <div className="font-medium truncate">{user?.full_name}</div>
                <div className="text-xs text-gray-500 capitalize truncate">{user?.role}</div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Bottom row on mobile / Right side on desktop: Main Navigation */}
          <nav className="flex items-center justify-center md:justify-end space-x-1 sm:space-x-2 md:space-x-4 pb-2 md:pb-0 border-t md:border-t-0 pt-2 md:pt-0">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Dashboard
            </Link>
            <Link
              to="/tickets"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Tickets
            </Link>
            {/* Settings on desktop (with text) */}
            {user?.role === 'admin' && (
              <Link
                to="/settings"
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
              >
                <Settings className="h-4 w-4 mr-1.5" />
                Settings
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
