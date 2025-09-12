//Path: app/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { TelegramCredentials } from '@/components/dashboard/TelegramCredentials';
import { EkycStatus } from '@/components/dashboard/EkycStatus';
import { PageLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useSDK();
  const [ekycStatus, setEkycStatus] = useState<string>('PENDING');

  useEffect(() => {
    // Get eKYC status from localStorage
    const localEkycStatus = localStorage.getItem('ekyc_status') || 'PENDING';
    setEkycStatus(localEkycStatus);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push('/login');
    }
  }, [isReady, isAuthenticated, router]);

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

  const isEkycApproved = ekycStatus === 'APPROVED';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.username || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your BRDZ Assistant profile and settings
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <UserProfile />
              <EkycStatus />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {isEkycApproved ? (
                <TelegramCredentials />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-medium text-yellow-800">
                        Identity Verification Required
                      </h3>
                      <p className="text-yellow-700 text-sm mt-2">
                        Please complete your eKYC verification to access your Telegram bot credentials
                      </p>
                    </div>
                    <a
                      href="/ekyc"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Complete Verification
                    </a>
                  </div>
                </div>
              )}

              {/* Additional Dashboard Cards */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href="/profile"
                    className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900">Edit Profile</div>
                    <div className="text-sm text-gray-600">Update your account information</div>
                  </a>
                  
                  {ekycStatus !== 'APPROVED' && (
                    <a
                      href="/ekyc"
                      className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-blue-900">Complete eKYC</div>
                      <div className="text-sm text-blue-700">Verify your identity to unlock all features</div>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Summary Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-medium text-green-600">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verification</span>
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Identity Verification</span>
                    <span className={`text-sm font-medium ${
                      ekycStatus === 'APPROVED' ? 'text-green-600' :
                      ekycStatus === 'PENDING' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {ekycStatus === 'APPROVED' ? 'Verified' :
                       ekycStatus === 'PENDING' ? 'Pending' : 'Required'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bot Access</span>
                    <span className={`text-sm font-medium ${
                      isEkycApproved ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {isEkycApproved ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}