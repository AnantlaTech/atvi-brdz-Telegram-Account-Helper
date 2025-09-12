//Path: app/forgot-password/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | BRDZ Assistant',
  description: 'Reset your BRDZ Assistant account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
        
        {/* Optional: Back to home link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}