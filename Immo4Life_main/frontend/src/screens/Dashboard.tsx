/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react';
import { CreateRealEstateButton, RealEstateCards, Toolbar } from '../components';
import { RealEstateType } from '../resources';

interface LoadContextProps {
    loadData: RealEstateType | 'all';
    setLoadData: React.Dispatch<React.SetStateAction<RealEstateType | 'all'>>;
    searchData: string;
    setSearchData: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Ein Context, der die Methoden zum Laden der Daten sowie die zu filternden Daten enthält
 */
export const DataContext = createContext<LoadContextProps>({
    loadData: 'all',
    setLoadData: () => {},
    searchData: '',
    setSearchData: () => {},
});

/**
 * Die Dashboard-Seite
 */
export const Dashboard = () => {
    const [loadData, setLoadData] = useState<RealEstateType | 'all'>('all');
    const [searchData, setSearchData] = useState('');

    return (
        <DataContext.Provider value={{ loadData, setLoadData, searchData, setSearchData }}>
            <div className="w-full h-auto">
                <Toolbar />
                <div className="w-full">
                    <RealEstateCards />
                    <CreateRealEstateButton />
                </div>
            </div>
        </DataContext.Provider>
    );
};
