"use client";
import { useState } from 'react';

export default function BillingPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Mock Stripe Checkout Flow
    setTimeout(() => {
      alert("Redirecting to Stripe Checkout...");
      setIsSubscribed(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your SaaS subscription and payment methods.</p>
      </div>

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {isSubscribed ? 'Pro Plan' : 'Free Trial'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {isSubscribed 
                  ? 'RM 99.00 / month. Renews automatically.' 
                  : 'Your trial expires in 14 days. Upgrade to avoid interruption.'}
              </p>
            </div>
            {!isSubscribed && (
              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                {loading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            )}
            {isSubscribed && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            )}
          </div>
        </div>
        
        {isSubscribed && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <button className="text-sm text-red-600 font-medium hover:text-red-800">
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm border rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice History</h2>
        {isSubscribed ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-sm text-gray-900">{new Date().toLocaleDateString()}</td>
                <td className="py-3 text-sm text-gray-900">RM 99.00</td>
                <td className="py-3 text-sm"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Paid</span></td>
                <td className="py-3 text-sm text-right"><button className="text-blue-600 hover:underline">Download</button></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No invoices yet.</p>
        )}
      </div>
    </div>
  );
}
