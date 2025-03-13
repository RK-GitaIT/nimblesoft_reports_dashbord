import { Beneficiary } from "../Beneficiary.model";
import { IRequests } from "./IRequests";

export interface IPersonalResidence {
    PersonalResidenceDevise?: boolean;
    Beneficiary?: Beneficiary[];
    Effective_date_of_devise?: string;
    Replacement_property?: boolean;
    beneficiaries_requests?: any;
    finalData?: any;
    ownershipType?: string; 
    back: string;
    next: string;
  }
  