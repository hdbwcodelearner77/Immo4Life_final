import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

/**
 * Die Header Bar der Seite
 * @returns HeaderBar
 */
export const Bar = () => {
    return (
        <header className="bg-blue-500">
            <div className="container mx-auto py-4 px-6">
                <nav className="flex items-center justify-between">
                    <a href=".." className="flex items-center text-white no-underline">
                        <FontAwesomeIcon icon={faHome} className="mr-2" />
                        <h1 className="text-xl font-semibold">Immo4Life</h1>
                    </a>
                </nav>
            </div>
        </header>
    );
};
