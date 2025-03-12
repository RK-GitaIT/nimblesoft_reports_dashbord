import { Beneficiary } from "../Beneficiary.model";

export interface IExecutors {
  title: string;
  sub_title: string;
  sub_title_description: string;
  members: Beneficiary[]; 
  bottomTitle?: string; 
  bottomDescription?: string; 
  filesTitle?: string; 
  back : string;
  next: string;
  filesNames?: string[]; 
}
