import { Beneficiary } from "../Beneficiary.model";

export interface IUltimateDisposition {
    ultimate_beneficiary: string,
    beneficiary_Details: any[],
    back: string;
    next: string;
  }
  