'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './context/AuthContext';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect during loading to avoid hydration issues
    if (loading) return;
    
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
