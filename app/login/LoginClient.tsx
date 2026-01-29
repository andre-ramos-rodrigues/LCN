'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../hooks/useApp';
import { UserRole } from '../../types';

const LoginClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setRole, setUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (user?.role === 'Admin') {
      //const from = searchParams.get('from') || '/admin';
      router.push('/');
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔥 REQUIRED FOR COOKIES
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (data.user.role !== 'Admin') {
        setError('Only admins can access this page');
        setIsLoading(false);
        return;
      }

      // Cookie is already set by the server
      setUser(data.user);
      setRole(UserRole.Admin);

      const from = searchParams.get('from') || '/admin';
      router.push(from);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-base-100 shadow-lg rounded-xl border">
        <h2 className="text-center text-3xl font-extrabold text-primary">
          Admin Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border rounded-t-md"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border rounded-b-md"
            placeholder="Password"
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginClient;
