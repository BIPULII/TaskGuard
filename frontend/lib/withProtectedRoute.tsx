'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './store';

export const withProtectedRoute = (Component: React.ComponentType<any>) => {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const { accessToken } = useAuthStore();

    useEffect(() => {
      if (!accessToken) {
        router.push('/login');
      }
    }, [accessToken, router]);

    if (!accessToken) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return <Component {...props} />;
  };
};
