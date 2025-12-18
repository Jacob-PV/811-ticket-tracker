/**
 * Terms of Use page
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900 font-medium">
          Independent beta product. Feedback does not create ownership, partnership, or work-for-hire relationships.
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
        <p>
          This software is an independently developed tool owned and operated by Jacob VanDoren.
        </p>

        <p>
          Use of this software does not grant users any ownership, intellectual property, or proprietary rights in the software or its underlying code, systems, or designs.
        </p>

        <p>
          This software is provided for internal tracking and informational purposes only and is not affiliated with, endorsed by, or operated by VA 811, any One Call system, or any utility provider.
        </p>

        <p>
          By using this software, you acknowledge that it is an independent product and that no employer, contractor, or third party obtains ownership or rights by virtue of use or feedback.
        </p>

        <p className="font-semibold">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
        </p>
      </div>
    </div>
  );
}
