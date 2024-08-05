export interface RealEstate {
    type: RealEstateType;
    address: string;
    postal: number;
    city: string;
    size: number;
    comment: string;
    shortHand: string;
    customerCount: number;
    image?: string;
}

export enum RealEstateType {
    APARTMENT = 'apartment',
    HOUSE = 'house',
    CONSTRUCTION_SITE = 'construction-site',
}
