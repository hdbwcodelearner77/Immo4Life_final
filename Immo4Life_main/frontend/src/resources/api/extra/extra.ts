import { initRequest } from '../../../utils';
import { ResponseError } from '../../types/Error';

/**
 * GET /createTestData
 * @returns Den Responsecode
 */
export const createTestData = async (): Promise<number | ResponseError> => {
    const config = initRequest('POST');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/createTestData`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : response.status;
};
