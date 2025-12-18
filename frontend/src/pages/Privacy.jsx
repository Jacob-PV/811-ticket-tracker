/**
 * Privacy Policy page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-4 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
        <p>
          This software is independently developed and operated by Jacob VanDoren.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Collection</h2>
        <p>
          This software collects and stores ticket tracking information you provide, including ticket numbers, addresses, job names, and related metadata for the purpose of helping you manage and track 811 utility tickets.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Usage</h2>
        <p>
          Your data is used solely for the purpose of providing ticket tracking functionality. We do not sell, share, or distribute your data to third parties.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Security</h2>
        <p>
          We implement reasonable security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-Party Services</h2>
        <p>
          This software may use third-party hosting and database services. These services have their own privacy policies and security measures.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Changes to Privacy Policy</h2>
        <p>
          This privacy policy may be updated from time to time. Continued use of the software constitutes acceptance of any changes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
        <p>
          For questions about this privacy policy, please contact Jacob VanDoren.
        </p>
      </div>
    </div>
  );
}
