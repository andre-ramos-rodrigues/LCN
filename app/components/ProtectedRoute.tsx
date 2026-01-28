'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../hooks/useApp';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { role } = useApp();
    const router = useRouter();

    useEffect(() => {
        // Redirect non-admin users to login page
        if (role !== UserRole.Admin) {
            router.push('/login');
        }
    }, [role, router]);

    // Show nothing while redirecting
    if (role !== UserRole.Admin) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute