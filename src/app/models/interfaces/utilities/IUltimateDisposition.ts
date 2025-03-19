import { Beneficiary } from "../Beneficiary.model";
import { IRequests } from "./IRequests";

export interface IUltimateDisposition {
    ultimate_beneficiary: string;
    beneficiary_Details:  IRequests[];
    persons?:Beneficiary[];
    back: string;
    next: string;
  }
  