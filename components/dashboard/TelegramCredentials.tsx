//Path: components\dashboard\TelegramCredentials.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useSDK } from '@/hooks/useSDK';
import { Copy, Eye, EyeOff, CheckCircle, Bot, AlertCircle, Shield } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

export const TelegramCredentials: React.FC = () => {
  const [showToken, setShowToken] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [ekycStatus, setEkycStatus] = useState<string>('PENDING');

  const { user, isAuthenticated, isReady } = useSDK();

  // Get credentials from localStorage and user state
  const getUserCredentials = () => {
    const token = localStorage.getItem('auth_token') || '';
    const userId = user?.user_id || '';
    const currentEkycStatus = localStorage.getItem('ekyc_status') || 'PENDING';
    
    return { token, userId, currentEkycStatus };
  };

  const { token, userId, currentEkycStatus } = getUserCredentials();

  useEffect(() => {
    setEkycStatus(currentEkycStatus);
  }, [currentEkycStatus]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      console.log(`${field} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const maskToken = (token: string) => {
    if (!token) return '••••••••••••••••••••••••••••••••';
    if (token.length <= 8) return '••••••••';
    return token.substring(0, 8) + '••••••••••••••••••••••••';
  };

  // Loading state
  if (!isReady) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Loading text="Loading credentials..." />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 rounded-lg p-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Authentication Required
            </h2>
            <p className="text-gray-600 text-sm">
              Please log in to view your Telegram bot credentials
            </p>
          </div>
        </div>
        <ErrorMessage message="User not authenticated. Please log in first." />
      </div>
    );
  }

  // eKYC not approved
  if (ekycStatus !== 'APPROVED') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-yellow-100 rounded-lg p-2">
            <Shield className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              eKYC Verification Required
            </h2>
            <p className="text-gray-600 text-sm">
              Complete identity verification to access Telegram bot credentials
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-sm font-medium text-yellow-800">
              Verification Status: {ekycStatus}
            </h3>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            {ekycStatus === 'PENDING' 
              ? 'Your identity verification is being processed. Please wait for approval.'
              : ekycStatus === 'REJECTED'
              ? 'Your verification was rejected. Please retry the verification process.'
              : 'Complete your identity verification to access MCP features through Telegram.'
            }
          </p>
          <a
            href="/ekyc"
            className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {ekycStatus === 'REJECTED' ? 'Retry Verification' : 'Complete Verification'}
          </a>
        </div>
      </div>
    );
  }

  // Missing credentials
  if (!token || !userId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 rounded-lg p-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Credentials Not Available
            </h2>
            <p className="text-gray-600 text-sm">
              Unable to retrieve your credentials
            </p>
          </div>
        </div>
        
        <ErrorMessage 
          message="Missing authentication credentials. Please try logging out and logging back in." 
        />
      </div>
    );
  }

  // Success state - show credentials
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 rounded-lg p-2">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Telegram Bot Credentials
          </h2>
          <p className="text-gray-600 text-sm">
            Use these credentials to connect with our Telegram bot
          </p>
        </div>
      </div>

      {/* Success indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            eKYC Verified - Bot Access Enabled
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm">
              {userId}
            </div>
            <button
              onClick={() => copyToClipboard(userId, 'userId')}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Copy User ID"
            >
              {copiedField === 'userId' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="text-xs">
                {copiedField === 'userId' ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Access Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Token
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm break-all">
              {showToken ? token : maskToken(token)}
            </div>
            <button
              onClick={() => setShowToken(!showToken)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title={showToken ? 'Hide Token' : 'Show Token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(token, 'token')}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Copy Token"
            >
              {copiedField === 'token' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="text-xs">
                {copiedField === 'token' ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          How to connect:
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open our Telegram bot (@BRDZBot)</li>
          <li>Use the /start command</li>
          <li>Enter your User ID and Access Token when prompted</li>
          <li>Start using BRDZ MCP services through Telegram!</li>
        </ol>
      </div>

      {/* Security notice */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-1">Security Notice:</h4>
        <p className="text-xs text-gray-600">
          Keep your credentials secure. Never share them with others or post them publicly. 
          If you suspect your credentials have been compromised, please contact support.
        </p>
      </div>

      {/* Development info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600 space-y-1">
          <p>User ID: {userId}</p>
          <p>eKYC Status: {ekycStatus}</p>
          <p>Token Length: {token.length}</p>
          <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
        </div>
      )}
    </div>
  );
};