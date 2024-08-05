import React, { useContext, useRef } from 'react';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { addImageToRealEstate, createRealEstate, deleteRealEstateByID, Listing, RealEstateType, updateRealEstateByID } from '../resources';
import { ResponseError } from '../resources/types/Error';
import defaultImage from '../images/default.jpg';
import { fileToBase64 } from '../utils';
import { ErrorBoundaryContext } from '../App';
import { Button } from '@mui/material';

export interface BaseLayoutInputsProps {
    listing: Listing | undefined;
    setListing: React.Dispatch<React.SetStateAction<Listing | undefined>>;
    isDetail?: boolean;
}

/**
 * Das Basislayout für die Anzeige sowie Editieren der Immobilien-Daten
 * @param listing - Die anzuzeigende Immobilie
 * @param setListing - Aktualisiert die anzuzeigende Immobilie
 * @param isDetail - Zeigt an, ob die Seite eine Detailseite sein soll, und somit readOnly
 * @returns Das Basislayout der Immobilie
 */
export const BaseLayoutInputs: React.FC<BaseLayoutInputsProps> = ({ listing, setListing, isDetail = false }) => {
    const navigate = useNavigate();
    const context = useContext(ErrorBoundaryContext);

    const realCreatedTime = listing?.createdOn ?? '';

    /**
     * Parst das Datumsfeld zu einem für das Frontend anzeigbares Datum
     * @returns Das anzuzeigende Datum
     */
    const getCreatedOn = () => {
        const newDate = new Date(listing?.createdOn ?? '').toISOString();
        return newDate.substring(0, newDate.length - 8);
    };

    const dropdownOptions = [
        {
            key: 'apartment',
            value: 'apartment',
            label: 'Apartment',
        },
        {
            key: 'house',
            value: 'house',
            label: 'Haus',
        },
        {
            key: 'construction-site',
            value: 'construction-site',
            label: 'Grundstück',
        },
    ];

    const defaultValues: Listing =
        listing && listing.id
            ? {
                  ...listing,
                  createdOn: getCreatedOn(),
              }
            : {
                  id: 0,
                  createdOn: new Date().toISOString(),
                  createdBy: '',
                  softwareVersion: '',
                  customer: '',
                  entry: {
                      type: RealEstateType.APARTMENT,
                      address: '',
                      postal: 12345,
                      city: '',
                      size: 0,
                      comment: '',
                      shortHand: '',
                      customerCount: 0,
                  },
              };

    /**
     * Handler für die Bildauswahl
     * @param event Das Event des Input-ELementes
     */
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && listing) {
            const formData = new FormData();
            const base64 = await fileToBase64(event.target.files[0]);
            formData.append('image', base64);
            const response = await addImageToRealEstate(listing.id, formData);

            if ((response as ResponseError).status) {
                context.setError(response as ResponseError);
            } else {
                const newListing: Listing = JSON.parse(JSON.stringify(listing));
                newListing.entry.image = base64;
                setListing(newListing);
            }
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Handler für den Klick auf das nicht sichtbare Input-Element
     */
    const handleCardMediaClick = () => {
        inputRef.current && !isDetail && inputRef.current.click();
    };

    /**
     * Aktualisiert oder speichert die Immobilie, je nach Bedarf, und navigiert zur Startseite
     * @param listing Die aktuell ausgewählte Immobilie
     */
    const onSubmit = async (listing: Listing) => {
        listing.entry.image = undefined;
        if (listing.id) {
            listing.createdOn = realCreatedTime;
            const response = await updateRealEstateByID(listing);

            if ((response as ResponseError).status) {
                context.setError(response as ResponseError);
            } else {
                navigate('/', { state: { fromUpdate: true } });
            }
        } else {
            const response = await createRealEstate(listing);

            if ((response as ResponseError).status) {
                context.setError(response as ResponseError);
            } else {
                navigate('/', { state: { fromCreate: true } });
            }
        }
    };

    /**
     * Löscht die aktuelle Immobilie und navigiert zur Startseite
     * @param listing Die aktuell ausgewählte Immobilie
     */
    const onDelete = async (listing: Listing) => {
        if (listing.id) {
            const response = await deleteRealEstateByID(listing.id);

            if ((response as ResponseError).status) {
                context.setError(response as ResponseError);
            } else {
                navigate('/', { state: { fromDelete: true } });
            }
        }
    };

    const readOnlyInput = {
        readOnly: isDetail,
    };

    return (
        <div className="w-full p-4">
            <FormContainer defaultValues={defaultValues} onSuccess={onSubmit}>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="p-4 flex justify-center">
                        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />
                        <img
                            onClick={handleCardMediaClick}
                            className="max-h-72 cursor-pointer"
                            src={listing && listing.entry.image ? listing.entry.image : defaultImage}
                            alt={'Listing Image'}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col justify-center p-4">
                            <div className="flex justify-end p-4 gap-4 w-full">
                                <TextFieldElement InputProps={readOnlyInput} name="id" label="ID" disabled className="w-1/2" />
                                <TextFieldElement InputProps={readOnlyInput} name="customer" label="Anbieter" required className="w-1/2" />
                            </div>
                        </div>
                        <div className="flex flex-col p-4">
                            <div className="flex justify-end p-4 gap-4 w-full">
                                <TextFieldElement
                                    InputProps={readOnlyInput}
                                    type={'datetime-local'}
                                    name="createdOn"
                                    label="Erstellt am"
                                    required
                                    className="w-1/2"
                                />
                                <TextFieldElement InputProps={readOnlyInput} name="createdBy" label="Erstellt von" className="w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 p-4">
                    <div className="w-full">
                        <div className="flex p-2 gap-2 w-full">
                            <SelectElement
                                className="w-1/4"
                                label="Immobilientyp"
                                labelKey="label"
                                valueKey="value"
                                name="entry.type"
                                options={dropdownOptions}
                                InputProps={readOnlyInput}
                            />
                            <TextFieldElement InputProps={readOnlyInput} name="entry.address" label="Straße & Hausnummer" required className="w-1/4" />
                            <TextFieldElement InputProps={readOnlyInput} name="entry.postal" label="PLZ" required className="w-1/4" />
                            <TextFieldElement InputProps={readOnlyInput} name="entry.city" label="Stadt" required className="w-1/4" />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex p-2 gap-2 w-full">
                            <TextFieldElement InputProps={readOnlyInput} name="entry.size" label="Größe" required className="w-1/4" />
                            <TextFieldElement InputProps={readOnlyInput} name="entry.shortHand" label="Kurzbeschreibung" required className="w-1/4" />
                            <TextFieldElement InputProps={readOnlyInput} name="entry.comment" label="Beschreibung" required className="w-1/2" />
                        </div>
                    </div>
                </div>

                {!isDetail && (
                    <>
                        <Button type={'submit'} style={{ margin: 32 }} variant={'contained'} color={'primary'}>
                            {listing && listing.id ? 'Aktualisieren' : 'Erstellen'}
                        </Button>
                        {listing && listing.id && (
                            <Button onClick={() => onDelete(listing)} style={{ margin: 32, float: 'right' }} variant={'contained'} color={'error'}>
                                Löschen
                            </Button>
                        )}
                    </>
                )}
            </FormContainer>
        </div>
    );
};
