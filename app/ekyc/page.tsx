//Path: app/ekyc/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SumsubForm } from '@/components/ekyc/SumsubForm';
import { PageLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function EkycPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useSDK();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push('/login');
    }
  }, [isReady, isAuthenticated, router]);

  // Check if already approved and redirect
  useEffect(() => {
    if (isAuthenticated) {
      const ekycStatus = localStorage.getItem('ekyc_status');
      if (ekycStatus === 'APPROVED') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router]);

  // Loading states
  if (!isReady) {
    return <PageLoading text="Initializing SDK..." />;
  }

  if (!isAuthenticated) {
    return <PageLoading text="Redirecting to login..." />;
  }

  if (!user.user_id) {
    return <PageLoading text="Loading user data..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
                <p className="text-gray-600 mt-2">
                  Complete your eKYC verification to access all BRDZ features
                </p>
              </div>
            </div>
          </div>

          {/* Information Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  What you'll need for verification:
                </h3>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• Government-issued photo ID (passport, driver's license, or national ID)</li>
                  <li>• Clear, well-lit photos of your documents</li>
                  <li>• A few minutes to complete the process</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Steps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="text-sm text-gray-600">Account Registration - Completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm font-medium text-gray-900">Identity Verification - In Progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-gray-400">Full Access - Pending</span>
              </div>
            </div>
          </div>

          {/* Sumsub Form */}
          <SumsubForm />

          {/* Help Section */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Verification usually takes 1-2 business days</p>
              <p>• Make sure your documents are clear and all corners are visible</p>
              <p>• For support, contact us at support@brdz.link</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}