import { Beneficiary } from "../Beneficiary.model";

export interface IPrepareFor {
  title: string;
  description: string;
  beneficiary: Beneficiary[]; 
  bottomTitle?: string; 
  bottomDescription?: string; 
  filesTitle?: string; 
  filesNames?: string[]; 
}
