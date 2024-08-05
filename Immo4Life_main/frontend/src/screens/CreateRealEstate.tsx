import React, { useState } from 'react';
import { Listing } from '../resources';
import { BaseLayoutInputs } from '../components';

/**
 * Die Seite für das Erstellen einer Immobilie
 */
export const CreateRealEstate = () => {
    const [listing, setListing] = useState<Listing>();

    return <BaseLayoutInputs listing={listing} setListing={setListing} />;
};
