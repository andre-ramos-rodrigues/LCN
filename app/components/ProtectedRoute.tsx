'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../hooks/useApp';
import { UserRole } from '../../types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { role, loading, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'Admin') {
      //const from = searchParams.get('from') || '/admin';
      router.push('/login');
    }
    
  }, [role, user, router]);

  // ⏳ Wait for auth check
  if (loading) {
    return null; // or spinner
  }

  if (role !== UserRole.Admin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
