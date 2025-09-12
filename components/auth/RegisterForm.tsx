//Path: components/auth/RegisterForm.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Eye, EyeOff, User, Mail, Phone, Globe, Building, Lock } from 'lucide-react';

// Client types sesuai dengan backend requirements
const CLIENT_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'BUSINESS', label: 'Business' },
];

// Countries sesuai dengan contoh yang diberikan + Vietnam
const COUNTRIES = [
  { value: 'ID', label: '🇮🇩 Indonesia' },
  { value: 'SG', label: '🇸🇬 Singapore' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'VN', label: '🇻🇳 Vietnam' }, // Added Vietnam as requested
];

// Phone prefixes untuk validation
const countryCodeToPhonePrefix: Record<string, string> = {
  ID: '62',
  SG: '65',
  IN: '91',
  AU: '61',
  US: '1',
  VN: '84', // Added Vietnam phone prefix
};

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    country_code: '', // Changed from 'country' to match SDK parameter
    client_type: '', // Changed from 'clientType' to match SDK parameter
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, isReady } = useSDK(); // Using useSDK instead of useAuth
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number prefix
    if (formData.country_code && formData.phone) {
      const expectedPrefix = countryCodeToPhonePrefix[formData.country_code];
      if (!formData.phone.startsWith(expectedPrefix)) {
        setError(`Phone number must start with ${expectedPrefix} for ${COUNTRIES.find(c => c.value === formData.country_code)?.label}`);
        return;
      }
    }

    // Check if SDK is ready
    if (!isReady) {
      setError('SDK is not ready. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for SDK (remove confirmPassword, add client_alias)
      const { confirmPassword, ...userData } = formData;
      const registrationData = {
        ...userData,
        client_alias: userData.username, // Add client_alias as required by SDK
      };

      console.log('Registration data:', registrationData);

      // Use SDK register method
      const response = await register(registrationData);
      
      if (response.success) {
        console.log('Registration successful:', response.data);
        
        // Store additional data if needed
        if (response.data.user?.e_kyc_status) {
          localStorage.setItem('ekyc_status', response.data.user.e_kyc_status);
        }
        if (response.data.client?.client_id) {
          localStorage.setItem('client_id', response.data.client.client_id);
        }
        
        // Redirect to login page after successful registration
        router.push('/login?registered=true');
      } else {
        throw new Error(response.error || 'Registration failed');
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join BRDZ Assistant Profile</p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country_code" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="country_code"
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder={formData.country_code ? `e.g. ${countryCodeToPhonePrefix[formData.country_code]}812345678` : 'Enter your phone number'}
              />
            </div>
            {formData.country_code && (
              <p className="text-xs text-gray-500 mt-1">
                Must start with {countryCodeToPhonePrefix[formData.country_code]} for {COUNTRIES.find(c => c.value === formData.country_code)?.label}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="client_type" className="block text-sm font-medium text-gray-700 mb-1">
              Client Type
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="client_type"
                name="client_type"
                value={formData.client_type}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select client type</option>
                {CLIENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
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
                placeholder="Create a password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading || !isReady}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isReady}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? <Loading size="small" /> : !isReady ? 'SDK Loading...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
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