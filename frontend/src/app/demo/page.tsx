'use client';

import Dashboard from '@/components/Dashboard';

export default function DemoPage() {
  // Mock authentication for demo purposes
  if (typeof window !== 'undefined') {
    // Set a mock token for demo
    localStorage.setItem('iosense_auth_token', 'Bearer demo_token');
    localStorage.setItem('iosense_organisation', 'demo_org');
    localStorage.setItem('iosense_user_id', 'demo_user');
  }

  return <Dashboard />;
}
