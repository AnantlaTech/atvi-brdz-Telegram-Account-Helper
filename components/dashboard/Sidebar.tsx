//Path: components/dashboard/Sidebar.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSDK } from '@/hooks/useSDK';
import { 
  LayoutDashboard, 
  User, 
  Shield, 
  LogOut,
  Bot,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  Wallet
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: Wallet,
    requiresEkyc: true,
  },
  {
    name: 'eKYC Status',
    href: '/ekyc',
    icon: Shield,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isReady } = useSDK();
  
  // State for showing/hiding credentials
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      // Manual clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('ekyc_status');
      
      // Force redirect
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force clear even if logout fails
      window.location.href = '/login';
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Get credentials for Telegram Bot
  const getUserCredentials = () => {
    const token = localStorage.getItem('auth_token') || 'Not available';
    const userId = user.user_id || 'Not available';
    const ekycStatus = localStorage.getItem('ekyc_status') || 'PENDING';
    
    return { token, userId, ekycStatus };
  };

  const { token, userId, ekycStatus } = getUserCredentials();

  // Filter navigation based on eKYC status
  const filteredNavigation = navigation.filter(item => {
    if (item.requiresEkyc) {
      return ekycStatus === 'APPROVED';
    }
    return true;
  });

  if (!isReady) {
    return (
      <div className="bg-white w-64 min-h-screen shadow-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img
            src="/BRDZ Shpper.png"
            alt="BRDZ"
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">BRDZ Assistant</h1>
            <p className="text-sm text-gray-600">Profile Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1 flex-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
              {/* Show badge for wallet if eKYC approved */}
              {item.name === 'Wallet' && ekycStatus === 'APPROVED' && (
                <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </Link>
          );
        })}

        {/* Show wallet notice if eKYC not approved */}
        {ekycStatus !== 'APPROVED' && (
          <div className="px-4 py-3 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span>Wallet</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-6">
              Complete eKYC to unlock
            </p>
          </div>
        )}
      </nav>

      {/* Telegram Bot Credentials Section */}
      {isAuthenticated && ekycStatus === 'APPROVED' && (
        <div className="px-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">
                  Telegram Bot Credentials
                </h3>
              </div>
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showCredentials ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {showCredentials && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white px-2 py-1 rounded text-xs border font-mono">
                      {userId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(userId, 'userId')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === 'userId' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Bearer Token
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white px-2 py-1 rounded text-xs border font-mono truncate">
                      {token.substring(0, 20)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(token, 'token')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === 'token' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                    💡 Use these credentials in your Telegram Bot to access MCP features
                  </p>
                  
                  <a 
                    href="https://t.me/BRDZ_shop_bot" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <span className="mr-2">🤖</span>
                    Open BRDZ Shop Bot
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="p-4">
        {isAuthenticated ? (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      ekycStatus === 'APPROVED' ? 'bg-green-500' : 
                      ekycStatus === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <p className="text-xs text-gray-500">
                      eKYC: {ekycStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Please log in to access your profile
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <p>SDK Ready: {isReady ? '✅' : '❌'}</p>
            <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
            <p>eKYC: {ekycStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
};