//Path: components/ekyc/SumsubForm.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

// Extend Window interface for Sumsub SDK
declare global {
  interface Window {
    snsWebSdk: any;
  }
}

interface SumsubFormProps {
  onComplete?: () => void;
}

export const SumsubForm: React.FC<SumsubFormProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [ekycStatus, setEkycStatus] = useState<string>('PENDING');
  const [manualSyncData, setManualSyncData] = useState<{
    reviewStatus: string | null;
    reviewAnswer: string | null;
  }>({
    reviewStatus: null,
    reviewAnswer: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { sdk, isReady, user } = useSDK();
  const router = useRouter();

  const handleManualSync = async () => {
    if (!user.user_id) {
      setError('User not logged in');
      return;
    }

    const applicantId = localStorage.getItem('sumsub_applicant_id');
    
    if (!applicantId) {
      setError('Manual sync failed: No applicant ID found');
      return;
    }

    // Since verification is completed, set default values if missing
    const reviewStatus = manualSyncData.reviewStatus || 'completed';
    const reviewAnswer = manualSyncData.reviewAnswer || 'GREEN';

    console.log('Manual sync data:', {
      applicantId,
      user_id: user.user_id,
      reviewStatus,
      reviewAnswer
    });

    try {
      const response = await sdk.ekyc.syncSumsubStatus({
        applicantId,
        user_id: user.user_id,
        reviewStatus,
        reviewAnswer,
      });

      if (response.success) {
        console.log('Sync Result:', response);
        localStorage.setItem('ekyc_status', 'APPROVED');
        
        if (onComplete) {
          onComplete();
        } else {
          router.push('/login');
        }
      } else {
        throw new Error(response.message || 'Sync failed');
      }
    } catch (err: any) {
      console.error('Manual sync error:', err);
      setError(err.message || 'Failed to sync eKYC status');
    }
  };

  const initSumsub = async () => {
    let sdkScript: HTMLScriptElement;
    
    try {
      setError('');
      setIsLoading(true);

      // Ensure user_id is available
      if (!user.user_id) {
        throw new Error('User ID is required for verification');
      }

      // Get user data from localStorage with fallbacks
      const email = localStorage.getItem('email') || user.email || 'demo@brdz.link';
      const phone = localStorage.getItem('phone') || '+62800000000';

      console.log('🚀 Initializing Sumsub with user_id:', user.user_id);

      // ✅ FIX: Call generateSumsubToken without parameters (as per SDK types)
      const tokenResponse = await sdk.ekyc.generateSumsubToken();
      
      if (!tokenResponse.success && !tokenResponse.token && !tokenResponse.data) {
        throw new Error('Failed to get Sumsub token - no success response');
      }

      // Handle different response formats
      const accessToken = tokenResponse.data?.token || tokenResponse.token || tokenResponse.data?.access_token;
      
      if (!accessToken) {
        console.error('Token response:', tokenResponse);
        throw new Error('No access token received from server');
      }

      console.log('✅ Sumsub token received successfully');

      // Load Sumsub SDK script
      sdkScript = document.createElement('script');
      sdkScript.src = 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js';
      sdkScript.async = true;

      sdkScript.onload = () => {
        try {
          console.log('✅ Sumsub SDK script loaded');
          
          // @ts-ignore - Sumsub SDK types not available
          if (!window.snsWebSdk) {
            throw new Error('Sumsub SDK not loaded properly');
          }

          console.log('🔧 Building Sumsub SDK instance...');
          
          const snsWebSdkInstance = window.snsWebSdk
            .init(accessToken, async () => {
              // ✅ FIX: Token refresh function without parameters
              try {
                console.log('🔄 Refreshing Sumsub token...');
                const refreshResponse = await sdk.ekyc.generateSumsubToken();
                const newToken = refreshResponse.data?.token || refreshResponse.token || refreshResponse.data?.access_token;
                
                if (!newToken) {
                  throw new Error('No token received during refresh');
                }
                
                console.log('✅ Token refreshed successfully');
                return newToken;
              } catch (err) {
                console.error('❌ Token refresh failed:', err);
                throw err;
              }
            })
            .withConf({ 
              lang: 'en', 
              email, 
              phone 
            })
            .withOptions({ 
              addViewportTag: false, 
              adaptIframeHeight: true 
            })
            .on('idCheck.onApplicantLoaded', (payload: any) => {
              if (payload.applicantId) {
                localStorage.setItem('sumsub_applicant_id', payload.applicantId);
                console.log('💾 Applicant ID loaded:', payload.applicantId);
              }
            })
            .on('idCheck.onApplicantStatusChanged', (payload: any) => {
              console.log('🔄 Sumsub Status Changed:', payload);

              setManualSyncData({
                reviewStatus: payload.reviewStatus || null,
                reviewAnswer: payload.reviewResult?.reviewAnswer || null,
              });

              if (
                payload.reviewStatus === 'completed' &&
                payload.reviewResult?.reviewAnswer === 'GREEN'
              ) {
                console.log('✅ Verification completed successfully');
                setIsVerified(true);
              }
            })
            .on('idCheck.onError', (error: any) => {
              console.error('❌ Sumsub SDK Error:', error);
              setError('Verification error occurred. Please try again.');
            })
            .build();

          console.log('🔧 SDK instance built, launching...');
          
          // Wait a bit for DOM to be ready
          setTimeout(() => {
            const container = document.getElementById('sumsub-container');
            if (!container) {
              console.error('❌ Container #sumsub-container not found');
              setError('Container not found. Please refresh the page.');
              return;
            }
            
            console.log('📍 Container found:', container);
            
            try {
              snsWebSdkInstance.launch('#sumsub-container');
              console.log('🎯 Sumsub SDK launched successfully');
            } catch (launchError) {
              console.error('❌ Launch error:', launchError);
              setError('Failed to launch verification form. Please refresh.');
            }
          }, 500);
          
          setIsLoading(false);
        } catch (err: any) {
          console.error('❌ Sumsub SDK initialization failed:', err);
          setError('Failed to initialize verification. Please refresh and try again.');
          setIsLoading(false);
        }
      };

      sdkScript.onerror = () => {
        console.error('❌ Failed to load Sumsub SDK script');
        setError('Failed to load verification system. Please check your internet connection.');
        setIsLoading(false);
      };

      document.body.appendChild(sdkScript);

      return () => {
        if (sdkScript && document.body.contains(sdkScript)) {
          document.body.removeChild(sdkScript);
        }
      };

    } catch (err: any) {
      console.error('❌ Sumsub initialization error:', err);
      setError(err.message || 'Failed to initialize verification');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkEkycStatusAndInit = async () => {
      try {
        if (!isReady || !user.user_id) {
          console.log('⏳ Waiting for SDK ready and user data...');
          return;
        }

        // Check localStorage first
        const localEkycStatus = localStorage.getItem('ekyc_status') || 'PENDING';
        setEkycStatus(localEkycStatus);
        console.log('📋 Local eKYC status:', localEkycStatus);

        // If already approved, redirect immediately
        if (localEkycStatus === 'APPROVED') {
          console.log('✅ Already approved, redirecting...');
          if (onComplete) {
            onComplete();
          } else {
            router.push('/dashboard');
          }
          return;
        }

        // If pending, proceed with Sumsub initialization
        if (localEkycStatus === 'PENDING') {
          console.log('🚀 Starting Sumsub initialization...');
          await initSumsub();
        } else {
          // If rejected or other status, show retry option
          setError('eKYC verification required. Please retry verification.');
          setIsLoading(false);
        }

      } catch (err: any) {
        console.error('❌ eKYC status check failed:', err);
        setError('Failed to check verification status');
        setIsLoading(false);
      }
    };

    if (isReady && user.user_id) {
      checkEkycStatusAndInit();
    } else if (isReady && !user.user_id) {
      setError('Please log in to complete verification');
      setIsLoading(false);
    }

  }, [isReady, user.user_id, router, onComplete]);

  if (!isReady || !user.user_id) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <Loading text="Initializing SDK..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <Loading text="Loading verification system..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <ErrorMessage message={error} />
        <div className="mt-4 space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          {ekycStatus !== 'PENDING' && (
            <button
              onClick={() => {
                localStorage.setItem('ekyc_status', 'PENDING');
                window.location.reload();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reset Status
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          e-KYC Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Complete your identity verification to access all features
        </p>
        
        <div 
          id="sumsub-container" 
          ref={containerRef}
          className="min-h-96 w-full"
          style={{ height: '700px' }}
        />

        {isVerified && (
          <div className="text-center mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Verification completed successfully!
              </p>
              <p className="text-green-600 text-sm">
                Please confirm to sync your status.
              </p>
            </div>
            
            <button
              onClick={handleManualSync}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Sync eKYC Status (Confirm)
            </button>
          </div>
        )}

        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
            <p>User ID: {user.user_id}</p>
            <p>SDK Ready: {isReady ? '✅' : '❌'}</p>
            <p>eKYC Status: {ekycStatus}</p>
            <p>Verified: {isVerified ? '✅' : '❌'}</p>
            {manualSyncData.reviewStatus && (
              <p>Review Status: {manualSyncData.reviewStatus}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};