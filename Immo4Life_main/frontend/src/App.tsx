/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './screens/Dashboard';
import { CreateRealEstate } from './screens/CreateRealEstate';
import { EditRealEstate } from './screens/EditRealEstate';
import { BaseLayout } from './components/BaseLayout';
import { ResponseError } from './resources';
import { DetailRealEstate } from './screens/DetailRealEstate';

interface ErrorContextProps {
    error: ResponseError;
    setError: React.Dispatch<React.SetStateAction<ResponseError>>;
}

interface IntervalContextProps {
    interval: NodeJS.Timer | undefined;
    setInterval: React.Dispatch<React.SetStateAction<NodeJS.Timer | undefined>>;
}

/**
 * Ein Context, der, falls welche auftreten sollten, den Fehler dazu beinhaltet
 */
export const ErrorBoundaryContext = createContext<ErrorContextProps>({
    error: {} as ResponseError,
    setError: () => {},
});

/**
 * Ein Context, der den aktuellen Interval speichert, sodass dieser nur einmal angelegt wird
 */
export const IntervalContext = createContext<IntervalContextProps>({
    interval: undefined,
    setInterval: () => {},
});

/**
 * Die Hauptkomponente der Anwendung, in der das Grundlayout, die Navigations-Routen
 * sowie die Hauptelemente der Anwendung beinhaltet
 */
function App() {
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const [error, setError] = useState<ResponseError>({} as ResponseError);
    const [interval, setInterval] = useState<NodeJS.Timer | undefined>();

    const routerElements = [
        {
            caseSensitive: true,
            path: '/',
            element: <Dashboard />,
        },
        {
            caseSensitive: true,
            path: '/create',
            element: <CreateRealEstate />,
        },
        {
            caseSensitive: true,
            path: '/edit',
            element: <EditRealEstate />,
        },
        {
            caseSensitive: true,
            path: '/detail/:id',
            element: <DetailRealEstate />,
        },
    ];

    const router = createBrowserRouter(routerElements);

    useEffect(() => {
        error.error && router.navigate('/');
    }, [error]);

    return (
        <ThemeProvider theme={theme}>
            <BaseLayout>
                <ErrorBoundaryContext.Provider value={{ error, setError }}>
                    <IntervalContext.Provider value={{ interval, setInterval }}>
                        <RouterProvider router={router} />
                    </IntervalContext.Provider>
                </ErrorBoundaryContext.Provider>
            </BaseLayout>
        </ThemeProvider>
    );
}

export default App;
