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
        <div className="flex justify-between items-center h-16 gap-2">
          {/* Logo and App Name */}
          <div className="flex items-center min-w-0 flex-shrink">
            <h1 className="text-base sm:text-xl font-bold text-primary-600 truncate">
              811 Tracker
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <Link
              to="/"
              className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/tickets"
              className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
              title="Tickets"
            >
              <FileText className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Tickets</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/settings"
                className="flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                title="Settings"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-shrink">
            <div className="hidden md:block text-sm text-gray-700 min-w-0">
              <div className="font-medium truncate">{user?.full_name}</div>
              <div className="text-xs text-gray-500 capitalize truncate">{user?.role}</div>
            </div>
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
      </div>
    </header>
  );
}
