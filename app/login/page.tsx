//Path: app/login/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | BRDZ Assistant',
  description: 'Sign in to your BRDZ Assistant account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        
        {/* Optional: Additional links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign up here
            </a>
          </p>
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}