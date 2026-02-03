// IOsense Authentication Service
import type { AuthResponse } from '@/types/iosense';

const IOSENSE_API_URL = process.env.NEXT_PUBLIC_IOSENSE_API_URL || 'https://connector.iosense.io/api';
const IOSENSE_ORG = process.env.NEXT_PUBLIC_IOSENSE_ORG || 'https://iosense.io';

const AUTH_TOKEN_KEY = 'iosense_auth_token';
const ORG_KEY = 'iosense_organisation';
const USER_ID_KEY = 'iosense_user_id';

/**
 * Validates SSO token and exchanges it for Bearer JWT token
 * SSO token must be generated from IOsense Portal → Profile
 * @param ssoToken - SSO token from URL query parameter
 */
export async function validateSSOToken(ssoToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(
      `${IOSENSE_API_URL}/retrieve-sso-token/${ssoToken}`,
      {
        method: 'GET',
        headers: {
          'organisation': IOSENSE_ORG,
          'ngsw-bypass': 'true',
          'Content-Type': 'application/json',
        },
      }
    );

    const data: AuthResponse = await response.json();

    if (data.success && data.token) {
      // Store auth data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        if (data.organisation) {
          localStorage.setItem(ORG_KEY, data.organisation);
        }
        if (data.userId) {
          localStorage.setItem(USER_ID_KEY, data.userId);
        }
      }
    }

    return data;
  } catch (error) {
    console.error('SSO token validation failed:', error);
    return {
      success: false,
      errors: ['Failed to validate SSO token'],
    };
  }
}

/**
 * Get stored auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get stored organisation from localStorage
 */
export function getOrganisation(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ORG_KEY);
}

/**
 * Get stored user ID from localStorage
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Clear authentication data from localStorage
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ORG_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

/**
 * Extract SSO token from URL query parameters
 */
export function extractSSOTokenFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}
