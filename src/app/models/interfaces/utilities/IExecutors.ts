import { Beneficiary } from "../Beneficiary.model";

export interface IExecutors {
  isTop_need?: boolean;
  title?: string;
  sub_title?: string;
  sub_title_description?: string;
  beneficiary: Beneficiary;
  members: Beneficiary[]; 
  bottomTitle?: string; 
  bottomDescription?: string; 
  filesTitle?: string; 
  back : string;
  next: string;
  filesNames?: string[]; 
}
