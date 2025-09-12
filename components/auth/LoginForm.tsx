// Path: components/auth/LoginForm.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    usernameoremail: '', // Changed from 'email' to match SDK parameter
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { login, isReady } = useSDK(); // Using useSDK instead of useAuth
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if SDK is ready
      if (!isReady) {
        throw new Error('SDK is not ready. Please try again.');
      }

      // Use SDK login method with correct parameters
      const response = await login(formData.usernameoremail, formData.password);
      
      if (response.success) {
        console.log('Login successful:', response.data);
        
        // Store additional data in localStorage if needed
        // (useSDK already handles token, user_id, username, email)
        if (response.data.user?.e_kyc_status) {
          localStorage.setItem('ekyc_status', response.data.user.e_kyc_status);
        }
        if (response.data.client?.client_id) {
          localStorage.setItem('client_id', response.data.client.client_id);
        }
        
        // Check eKYC status and redirect accordingly
        const ekycStatus = response.data.user?.e_kyc_status || 'PENDING';
        
        if (ekycStatus === 'APPROVED') {
          router.push('/dashboard');
        } else {
          // Redirect to eKYC verification if not approved
          router.push('/ekyc');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <img
            src="/BRDZ Shpper.png"
            alt="BRDZ"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to your BRDZ Assistant account</p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usernameoremail" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="usernameoremail"
                name="usernameoremail" // Changed from 'email' to match SDK
                value={formData.usernameoremail}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter your email or username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isReady}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? <Loading size="small" /> : !isReady ? 'SDK Loading...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
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