import { RealEstate } from "./RealEstate";

export interface Listing {
  id: number;
  createdOn: string;
  createdBy: string;
  softwareVersion: string;
  customer: string;
  entry: RealEstate;
}
