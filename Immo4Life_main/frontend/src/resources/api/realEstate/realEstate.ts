import { initRequest } from '../../../utils';
import { Listing } from '../../types';
import { ResponseError } from '../../types/Error';

/**
 * GET /realEstate/
 * @returns Alle verfügbaren Immobilien
 */
export const listAllRealEstates = async (): Promise<Listing[] | ResponseError> => {
    const config = initRequest('GET');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : (responseParsed as Listing[]);
};

/**
 * POST /realEstate/
 * @param realEstate - Die zu erstellende Immobilie
 * @returns Den Responsecode
 */
export const createRealEstate = async (realEstate: Listing): Promise<number | ResponseError> => {
    const config = initRequest('POST', realEstate);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : response.status;
};

/**
 * GET /realEstate/:id
 * @param realEstateId - Die ID der Immobilie
 * @returns Die geladene Immobilie
 */
export const getRealEstateByID = async (realEstateId: number): Promise<Listing | ResponseError> => {
    const config = initRequest('GET');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate/${realEstateId}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : (responseParsed as Listing);
};

/**
 * PUT /realEstate/:id
 * @param updatedRealEstate - Die zu aktualisierende Immobilie
 * @returns Die aktualisierte Immobilie
 */
export const updateRealEstateByID = async (updatedRealEstate: Listing): Promise<Listing | ResponseError> => {
    const config = initRequest('PUT', updatedRealEstate);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate/${updatedRealEstate.id}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : (responseParsed as Listing);
};

/**
 * DELETE /realEstate/:id
 * @param realEstateId  - Die ID der zu löschende Immobilie
 * @returns Den Responsecode
 */
export const deleteRealEstateByID = async (realEstateId: number): Promise<number | ResponseError> => {
    const config = initRequest('DELETE');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate/${realEstateId}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : response.status;
};

/**
 * PUT /realEstate/:id/image
 * @param realEstateID - Die Immobilienid
 * @param image - Das Bild als FormData
 * @returns Das aktualisierte Bild
 */
export const addImageToRealEstate = async (realEstateId: number, image: FormData): Promise<string | ResponseError> => {
    const config = initRequest('PUT', image, undefined, true);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate/${realEstateId}/image`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : responseParsed.image;
};
