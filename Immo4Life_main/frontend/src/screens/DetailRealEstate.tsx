import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ErrorBoundaryContext } from '../App';
import { BaseLayoutInputs } from '../components';
import { getRealEstateByID, Listing, ResponseError } from '../resources';

/**
 * Die Detailseite für eine Immobilie
 */
export const DetailRealEstate = () => {
    const [listing, setListing] = useState<Listing>();
    const { id } = useParams();
    const context = useContext(ErrorBoundaryContext);

    /**
     * Methode zum Laden einer Immobilie
     */
    const loadListing = async () => {
        if (id) {
            const response = await getRealEstateByID(Number.parseInt(id));
            if ((response as ResponseError).status) {
                context.setError(response as ResponseError);
            } else {
                const data = response as Listing;
                setListing(data);
            }
        }
    };

    useEffect(() => {
        loadListing();
    }, []);

    return listing?.id ? <BaseLayoutInputs listing={listing} setListing={setListing} isDetail /> : <React.Fragment />;
};
