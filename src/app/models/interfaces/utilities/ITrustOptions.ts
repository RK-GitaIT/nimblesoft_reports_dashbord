import { Beneficiary } from "../Beneficiary.model";
import { IRealEstateEntry } from "./IRealEstateEntry";

export interface ITrustOptions {
      user?: Beneficiary,
      title?: string;
      title2?: string;
      sub_title?: string;
      sub_title_description?: string;
      input_label?: string; 
      input_value?: string; 
      revocable_radio_description?:string;
      revocable_radio_value?:boolean;
      bottomDescription?: string; 
      back : string;
      next: string;
}