'use client';

import { useEffect, useState } from 'react';
import {
  isAuthenticated,
  extractSSOTokenFromURL,
  validateSSOToken
} from '@/auth/iosense-auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if already authenticated
        if (isAuthenticated()) {
          setIsAuth(true);
          setIsLoading(false);
          return;
        }

        // Check for SSO token in URL
        const ssoToken = extractSSOTokenFromURL();
        if (ssoToken) {
          // Validate SSO token
          const result = await validateSSOToken(ssoToken);
          if (result.success) {
            setIsAuth(true);
            // Remove token from URL
            window.history.replaceState({}, '', window.location.pathname);
          } else {
            setError('Failed to validate SSO token. Please generate a new token from IOsense Portal.');
          }
        } else {
          setError('No authentication token found. Please login via IOsense Portal.');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
          <p className="mt-4 text-gray-700 text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">How to authenticate:</h3>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>Log into IOsense Portal</li>
                <li>Navigate to Profile section</li>
                <li>Generate SSO Token</li>
                <li>Append token to this URL: <code className="bg-gray-200 px-1 rounded">?token=YOUR_TOKEN</code></li>
              </ol>
            </div>
            <a
              href="https://iosense.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Go to IOsense Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
