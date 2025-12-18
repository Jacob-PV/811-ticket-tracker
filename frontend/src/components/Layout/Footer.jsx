/**
 * App footer with legal information
 */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            © 2025 Jacob VanDoren. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Independent software. Not affiliated with VA 811 or any utility provider.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/terms"
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
