import { initRequest } from '../../../utils';
import { ResponseError } from '../../types/Error';

/**
 * PUT /customer/:realEstateId
 * @param realEstateId - Die Immobilienid
 * @returns Die neue Favoritenanzahl
 */
export const addCustomerToRealEstate = async (realEstateId: number): Promise<{ count: number } | ResponseError> => {
    const config = initRequest('PUT');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/customer/${realEstateId}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : responseParsed.count;
};

/**
 * GET /customer/:realEstateId
 * @param realEstateId - Die Immobilienid
 * @returns Die aktuelle Favoritenanzahl
 */
export const getAllCustomersFromRealEstate = async (realEstateId: number): Promise<{ count: number } | ResponseError> => {
    const config = initRequest('GET');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/customer/${realEstateId}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : responseParsed.count;
};
