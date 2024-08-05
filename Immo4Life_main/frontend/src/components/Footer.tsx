import React from 'react';

/**
 * Der Footer für die Hauptseite
 * @returns Den Footer für die Hauptseite
 */
export const Footer = () => {
    return (
        <footer className="absolute bottom-2 w-full flex flex-col items-center p-0">
            <h6 className="text-center text-lg font-semibold mb-1">Immo4Life</h6>
            <p className="text-center text-gray-600">Ihre Immobilien sind unsere Zukunft!</p>
        </footer>
    );
};
