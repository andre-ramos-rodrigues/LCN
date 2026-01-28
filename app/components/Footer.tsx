'use client'

import React from 'react';
import { useTheme } from '../hooks/useTheme';

const Footer: React.FC = () => {
    const { theme } = useTheme();

    return (
        <footer className="bg-base-100 border-t border-gray-200">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-text-secondary">
                <p>{theme.footerText}</p>
            </div>
        </footer>
    );
};

export default Footer;