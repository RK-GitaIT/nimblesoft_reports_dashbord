import { Beneficiary } from "../Beneficiary.model";
import { IRequests } from "./IRequests";

export interface IUltimateDisposition {
    ultimate_beneficiary: string,
    beneficiary_Details:  IRequests[]
    back: string;
    next: string;
  }
  