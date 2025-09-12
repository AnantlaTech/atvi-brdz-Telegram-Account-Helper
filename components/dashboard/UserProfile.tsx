//Path: components/dashboard/UserProfile.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useSDK } from '@/hooks/useSDK';
import { User, Mail, Phone, Globe, Building, Calendar, RefreshCw } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface UserData {
  user_id?: string;
  username?: string;
  email?: string;
  phone?: string;
  country_code?: string;
  client_type?: string;
  created?: string;
  ekyc_status?: string;
  ekyc_country?: string;
}

// Country mapping untuk display
const COUNTRY_NAMES: Record<string, string> = {
  'ID': '🇮🇩 Indonesia',
  'SG': '🇸🇬 Singapore', 
  'IN': '🇮🇳 India',
  'AU': '🇦🇺 Australia',
  'US': '🇺🇸 United States',
  'VN': '🇻🇳 Vietnam',
};

// Client type mapping
const CLIENT_TYPE_NAMES: Record<string, string> = {
  'INDIVIDUAL': 'Individual',
  'CORPORATE': 'Corporate',
  'BUSINESS': 'Business',
};

export const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const { user, isAuthenticated, isReady, sdk } = useSDK();

  const fetchUserProfile = async (forceRefresh = false) => {
    if (!isReady || !user.user_id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Load all data from localStorage only
      const mappedData: UserData = {
        user_id: user.user_id,
        username: user.username || localStorage.getItem('username') || undefined,
        email: user.email || localStorage.getItem('email') || undefined,
        phone: localStorage.getItem('phone') || undefined,
        country_code: localStorage.getItem('country_code') || undefined,
        client_type: localStorage.getItem('client_type') || undefined,
        ekyc_status: localStorage.getItem('ekyc_status') || undefined,
        created: localStorage.getItem('created_at') || undefined,
      };

      setProfileData(mappedData);
      console.log('Profile data loaded from localStorage:', mappedData);
      
    } catch (err: any) {
      console.error('Profile load error:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isReady && isAuthenticated && user.user_id) {
      fetchUserProfile();
    } else if (isReady && !isAuthenticated) {
      setError('Please log in to view profile');
      setIsLoading(false);
    }
  }, [isReady, isAuthenticated, user.user_id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCountry = (countryCode?: string) => {
    if (!countryCode) return 'Not specified';
    return COUNTRY_NAMES[countryCode] || countryCode;
  };

  const formatClientType = (type?: string) => {
    if (!type) return 'Not specified';
    return CLIENT_TYPE_NAMES[type] || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const handleRefresh = () => {
    fetchUserProfile(true);
  };

  if (!isReady) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Loading text="Initializing SDK..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <ErrorMessage message="Please log in to view your profile" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Loading text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <p className="text-gray-600 text-sm">Your account details</p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onRetry={() => fetchUserProfile(true)} />
        </div>
      )}

      {profileData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Username</label>
              </div>
              <p className="text-gray-900 pl-6">{profileData.username || 'Not set'}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Email</label>
              </div>
              <p className="text-gray-900 pl-6">{profileData.email || 'Not set'}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Phone</label>
              </div>
              <p className="text-gray-900 pl-6">{profileData.phone || 'Not set'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Globe className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Country</label>
              </div>
              <p className="text-gray-900 pl-6">{formatCountry(profileData.country_code)}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Building className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Client Type</label>
              </div>
              <p className="text-gray-900 pl-6">{formatClientType(profileData.client_type)}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Member Since</label>
              </div>
              <p className="text-gray-900 pl-6">{formatDate(profileData.created)}</p>
            </div>
          </div>
        </div>
      )}

      {/* eKYC Status Badge */}
      {profileData?.ekyc_status && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Verification Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              profileData.ekyc_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              profileData.ekyc_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {profileData.ekyc_status}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="/profile"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </a>
      </div>

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600 space-y-1">
          <p>User ID: {profileData?.user_id}</p>
          <p>SDK Ready: {isReady ? '✅' : '❌'}</p>
          <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
          <p>Data Source: localStorage only</p>
          <p>eKYC: {profileData?.ekyc_status || 'Unknown'}</p>
          <p>API Error: {error ? '❌' : '✅'}</p>
        </div>
      )}
    </div>
  );
};