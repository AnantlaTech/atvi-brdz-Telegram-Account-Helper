//Path: components/auth/ForgotPasswordForm.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSDK } from '@/hooks/useSDK';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Mail, CheckCircle } from 'lucide-react';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { sdk, isReady } = useSDK(); // Using useSDK instead of apiClient

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if SDK is ready
      if (!isReady) {
        throw new Error('SDK is not ready. Please try again.');
      }

      // Use SDK forgotPassword method
      const response = await sdk.auth.forgotPassword(email);
      
      if (response.success) {
        console.log('Password reset email sent:', response);
        setIsSuccess(true);
      } else {
        throw new Error(response.message || response.error || 'Failed to send reset email');
      }
      
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <img
            src="/BRDZ Shpper.png"
            alt="BRDZ"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isReady}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? <Loading size="small" /> : !isReady ? 'SDK Loading...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to login
          </Link>
        </div>

        {/* SDK Status Indicator for Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            SDK Status: {isReady ? '✅ Ready' : '⏳ Loading'}
          </div>
        )}
      </div>
    </div>
  );
};