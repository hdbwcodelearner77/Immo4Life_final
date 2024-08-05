import React, { useContext, useEffect, useRef, useState } from 'react';
import { addCustomerToRealEstate, filterByLocationOrType, listAllRealEstates, Listing, RealEstateType } from '../resources';
import { ErrorTypeEnum, ResponseError } from '../resources/types/Error';
import { EstateCard } from './EstateCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Grid } from '@mui/material';
import { AlertData } from '../utils';
import { DataContext } from '../screens/Dashboard';
import { ErrorBoundaryContext, IntervalContext } from '../App';

/**
 * Die Liste der Karten für das Dashboard
 * @returns Die Liste der Karten für das Dashboard
 */
export const RealEstateCards = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const alertData = useRef<AlertData>();
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(ErrorBoundaryContext);
    const intervalContext = useContext(IntervalContext);

    const { loadData, searchData } = useContext(DataContext);

    /**
     * Lädt die Immobilien für das Dashboard
     */
    const loadRealEstates = async () => {
        const response = await listAllRealEstates();
        if ((response as ResponseError).status) {
            context.setError(response as ResponseError);
        } else {
            const data = response as Listing[];
            setListings(data);
        }
    };

    /**
     * Lädt die Immobilien für das Dashboard anhand des gegebenen Immobilientyps
     */
    const loadRealEstatesWithFilter = async () => {
        const response = await filterByLocationOrType(undefined, loadData as RealEstateType);
        if ((response as ResponseError).status) {
            context.setError(response as ResponseError);
        } else {
            const data = response as Listing[];
            setListings(data);
        }
    };

    /**
     * Lädt die Immobilien für das Dashboard anhang des gegebenen Adressenfilters
     */
    const loadRealEstatesWithSearchFilter = async () => {
        const response = await filterByLocationOrType(searchData);
        if ((response as ResponseError).status) {
            context.setError(response as ResponseError);
        } else {
            const data = response as Listing[];
            setListings(data);
        }
    };

    /**
     * Aufgabe 3
     */
    const startLoadingMechanism = () => {
        const interval = setInterval(() => loadAndCheckEstates(true), 20 * 1000);
        intervalContext.setInterval(interval);
    };

    /**
     * Lädt die Dashboard-Daten
     * @param fromInterval Wert, ob der Aufruf von dem Interval stammt
     */
    const loadAndCheckEstates = (fromInterval = false) => {
        if (loadData === 'all' && searchData === '') {
            loadRealEstates();
        } else if (loadData !== 'all') {
            loadRealEstatesWithFilter();
        } else {
            loadRealEstatesWithSearchFilter();
        }

        if (!intervalContext.interval && !fromInterval) {
            startLoadingMechanism();
        }
    };

    useEffect(() => {
        loadAndCheckEstates();
    }, [loadData, searchData]);

    /**
     * Prüft, ob es Daten aus vorhandenen Komponenten gibt
     * Es gibt einen Status vom Löschen, Aktualisieren, Erstellen sowie bei einem Fehler
     */
    const checkLocation = () => {
        if (location.state && (location.state.fromUpdate || location.state.fromCreate || location.state.fromDelete)) {
            const text = location.state.fromUpdate ? 'aktualisiert' : location.state.fromCreate ? 'angelegt' : 'gelöscht';
            window.history.replaceState({}, document.title);
            const alertSuccess: AlertData = { text: 'Erfolgreich', message: `Die Daten wurden erfolgreich ${text}!`, type: 'success' };
            alertData.current = alertSuccess;
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
        if (context.error.error) {
            context.setError({} as ResponseError);
            const alertError: AlertData = {
                text: 'Fehler',
                message: `${ErrorTypeEnum[context.error.error.errorType]}: ${context.error.error.message} | Code: ${context.error.status}`,
                type: 'error',
            };
            alertData.current = alertError;
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    useEffect(() => {
        checkLocation();
    }, []);

    /**
     * Speichert den Favorit für eine Immobilie
     * @param id Die ID der Immobilie
     */
    const heartClick = async (id: number) => {
        const response = await addCustomerToRealEstate(id);
        if (typeof response === 'number') {
            const newListings = listings.map((listing) => {
                if (listing.id === id) {
                    return {
                        ...listing,
                        entry: {
                            ...listing.entry,
                            customerCount: response,
                        },
                    };
                }
                return listing;
            });
            setListings(newListings);
        } else {
            context.setError(response as ResponseError);
        }
    };

    /**
     * Öffnet die Bearbeitungs-Seite für eine Immobilie
     * @param id Die ID der Immobilie
     */
    const handleEdit = (id: number) => {
        navigate('/edit', { state: { id: id } });
    };

    /**
     * Öffnet die Detailseite für eine Immobilie
     * @param id Die ID der Immobilie
     */
    const handleDetail = (id: number) => {
        navigate(`/detail/${id}`);
    };

    return (
        <Grid container spacing={2}>
            {listings?.map((listing) => (
                <EstateCard key={listing.id} listing={listing} heartClick={heartClick} handleEdit={handleEdit} handleDetail={handleDetail} />
            ))}
            {showAlert && (
                <Alert
                    onClick={() => setShowAlert(false)}
                    variant="filled"
                    style={{ position: 'absolute', cursor: 'pointer', top: 20, right: 20 }}
                    severity={alertData.current?.type}
                >
                    <AlertTitle>{alertData.current?.text}</AlertTitle>
                    {alertData.current?.message}
                </Alert>
            )}
        </Grid>
    );
};
