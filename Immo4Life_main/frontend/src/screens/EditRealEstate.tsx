import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRealEstateByID, Listing } from '../resources';
import { ResponseError } from '../resources/types/Error';
import { BaseLayoutInputs } from '../components';
import { ErrorBoundaryContext } from '../App';

/**
 * Die Seite für das Editieren einer Immobilie
 */
export const EditRealEstate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(ErrorBoundaryContext);

    const [listing, setListing] = useState<Listing>();

    /**
     * Methode zum Laden einer Immobilie
     */
    const loadListing = async () => {
        const response = await getRealEstateByID(location.state.id);
        if ((response as ResponseError).status) {
            context.setError(response as ResponseError);
        } else {
            const data = response as Listing;
            setListing(data);
        }
    };

    useEffect(() => {
        if (location.state === null || location.state.id === undefined) {
            navigate('/');
        } else {
            loadListing();
        }
    }, []);

    return <>{listing && listing.id && <BaseLayoutInputs listing={listing} setListing={setListing} />}</>;
};
