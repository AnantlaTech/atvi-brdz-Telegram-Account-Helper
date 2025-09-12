//Path: app/register/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | BRDZ Assistant',
  description: 'Create your BRDZ Assistant account to access MCP features',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
        
        {/* Additional information */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign in here
            </a>
          </p>
          
          <div className="text-xs text-gray-500 max-w-sm mx-auto">
            <p>
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Complete identity verification will be required to access all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}