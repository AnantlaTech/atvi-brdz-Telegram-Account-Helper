//Path: app/profile/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { PageLoading } from '@/components/ui/loading';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useSDK();

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              View and manage your personal information
            </p>
          </div>

          {/* Use existing UserProfile component */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
}