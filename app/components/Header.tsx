'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '../hooks/useTheme'
import { useApp } from '../hooks/useApp'
import { UserRole } from '../../types'

const Header: React.FC = () => {
    const { theme } = useTheme()
    const { role, logout } = useApp()
    const router = useRouter()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinkClasses =
        'px-3 py-2 rounded-md text-text-primary text-sm transition-colors duration-200'
    const activeLinkClasses = 'text-primary font-bold'
    const inactiveLinkClasses = 'text-text-primary font-medium'

    const handleLogout = () => {
        logout()
        router.push('/')
        setMenuOpen(false)
    }

    return (
        <header className="bg-base-100 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            {theme.headerText}
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-text-primary text-2xl"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>

                    {/* Desktop menu */}
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className={`${navLinkClasses} ${
                                    pathname === '/'
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/blog"
                                className={`${navLinkClasses} ${
                                    pathname === '/blog'
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {role === UserRole.Admin ? (
                                <div className="flex items-center space-x-4">
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
                                        className={`${navLinkClasses} ${inactiveLinkClasses} text-secondary`}
                                    >
                                        Logout
                                    </button>
                                </div>
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
                        </div>
                    </nav>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <nav className="md:hidden absolute top-full left-0 w-full bg-base-100 z-50 shadow-lg flex flex-col space-y-2 pb-4">
                        <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                            className={`${navLinkClasses} ${
                                pathname === '/'
                                    ? activeLinkClasses
                                    : inactiveLinkClasses
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/blog"
                            onClick={() => setMenuOpen(false)}
                            className={`${navLinkClasses} ${
                                pathname === '/blog'
                                    ? activeLinkClasses
                                    : inactiveLinkClasses
                            }`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setMenuOpen(false)}
                            className={`${navLinkClasses} ${
                                pathname === '/contact'
                                    ? activeLinkClasses
                                    : inactiveLinkClasses
                            }`}
                        >
                            Contato
                        </Link>

                        {role === UserRole.Admin ? (
                            <>
                                <Link
                                    href="/admin/content"
                                    onClick={() => setMenuOpen(false)}
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
                                    onClick={() => setMenuOpen(false)}
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
                                    onClick={() => setMenuOpen(false)}
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
                                    className={`${navLinkClasses} ${inactiveLinkClasses} text-secondary text-left`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
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
                )}
            </div>
        </header>
    )
}

export default Header
