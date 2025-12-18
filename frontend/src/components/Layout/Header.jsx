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
        {/* Two-row layout on mobile, three-column layout on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 md:items-center md:h-16">

          {/* Mobile: Top row - Logo + Settings icon + Logout */}
          {/* Desktop: Left column - Logo */}
          <div className="flex justify-between items-center h-14 md:h-16 md:justify-start">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary-600 truncate">
              811 Ticket Tracker
            </h1>

            {/* Mobile only: Settings icon */}
            <div className="flex items-center space-x-1 md:hidden">
              {user?.role === 'admin' && (
                <Link
                  to="/settings"
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile: Bottom row - Navigation */}
          {/* Desktop: Center column - Navigation centered */}
          <nav className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4 pb-2 md:pb-0 border-t md:border-t-0 pt-2 md:pt-0">
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

          {/* Desktop only: Right column - User info */}
          <div className="hidden md:flex items-center justify-end space-x-4">
            <div className="text-sm text-gray-700">
              <div className="font-medium">{user?.full_name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
