import { Beneficiary } from "../Beneficiary.model";
import { IRequests } from "./IRequests";

export interface RealEstateEntry {
    requests: IRequests[];
    address?: string;
    ownershipType?: string;
    Effective_date_of_devise?: string;
  }
  
 export interface IRealEstateEntry {
    EstateDetails?: RealEstateEntry[];
    Beneficiary?: Beneficiary[];
  }