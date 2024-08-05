import React from 'react';
import { Bar } from './Bar';
import { Footer } from './Footer';
import { CssBaseline } from '@mui/material';

interface BayeLayoutProps {
    children: React.ReactNode;
}

/**
 * Das Grundlayout des Hauptinhaltes
 * @param children - Kindkomponenten
 * @returns Das Basislayout mit Kindkomponenten
 */
export const BaseLayout: React.FC<BayeLayoutProps> = ({ children }) => {
    return (
        <>
            <CssBaseline />
            <Bar />
            <div className="container mx-auto py-8 h-4/5 w-full max-w-screen-xl">
                <div className="grid grid-cols-1 gap-4 h-full overflow-y-scroll">{children}</div>
            </div>
            <Footer />
        </>
    );
};
