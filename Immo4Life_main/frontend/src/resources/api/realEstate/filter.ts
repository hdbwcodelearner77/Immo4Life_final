import { initRequest } from '../../../utils';
import { Listing, RealEstateType } from '../../types';
import { ResponseError } from '../../types/Error';

/**
 * GET /realEstate?filterType=house
 * GET /realEstate?filterLocation=heidenheim
 * @param filterLocation - Der Adress-Filter
 * @param filterType - Der Immobilientypfilter
 * @returns Die gefilterten Immobilien
 */
export const filterByLocationOrType = async (filterLocation?: string, filterType?: RealEstateType): Promise<Listing[] | ResponseError> => {
    const config = initRequest('GET');
    const urlSearchParams = new URLSearchParams({
        filterLocation: filterLocation ?? '',
        filterType: filterType ?? '',
    });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/realEstate?${urlSearchParams}`, config);
    const responseParsed = await response.json();
    return response.status !== 200 ? { status: response.status, error: responseParsed } : (responseParsed as Listing[]);
};
