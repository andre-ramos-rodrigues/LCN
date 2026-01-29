'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../hooks/useApp';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAdmin, logout, loading } = useApp();

  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClasses =
    'px-3 py-2 rounded-md text-text-primary text-sm transition-colors duration-200';
  const activeLinkClasses = 'text-primary font-bold';
  const inactiveLinkClasses = 'text-text-primary font-medium';

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/login');
  };

  // ⏳ Evita piscar Login/Admin enquanto valida cookie
  //if (loading) return null;

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            {theme.headerText}
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-primary text-2xl"
          >
            ☰
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`${navLinkClasses} ${
                pathname === '/' ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`${navLinkClasses} ${
                pathname === '/blog' ? activeLinkClasses : inactiveLinkClasses
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`${navLinkClasses} ${
                pathname === '/contact'
                  ? activeLinkClasses
                  : inactiveLinkClasses
              }`}
            >
              Contato
            </Link>

            {user?.role === 'Admin' ? (
              <>
                <Link
                  href="/admin/content"
                  className={`${navLinkClasses} ${
                    pathname === '/admin/content'
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }`}
                >
                  Conteúdo
                </Link>
                <Link
                  href="/admin"
                  className={`${navLinkClasses} ${
                    pathname === '/admin'
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }`}
                >
                  Layout
                </Link>
                <Link
                  href="/dashboard"
                  className={`${navLinkClasses} ${
                    pathname === '/dashboard'
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }`}
                >
                  Moderação
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${navLinkClasses} text-secondary`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`${navLinkClasses} ${
                  pathname === '/login'
                    ? activeLinkClasses
                    : inactiveLinkClasses
                }`}
              >
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col space-y-2 py-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contato
            </Link>

            {isAdmin ? (
              <>
                <Link href="/admin/content">Conteúdo</Link>
                <Link href="/admin">Layout</Link>
                <Link href="/dashboard">Moderação</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
