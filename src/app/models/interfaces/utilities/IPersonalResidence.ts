import { Beneficiary } from "../Beneficiary.model";
import { IRealEstateEntry } from "./IRealEstateEntry";
import { IRequests } from "./IRequests";

export interface IPersonalResidence {
    data?:IRealEstateEntry;
    Beneficiary?: Beneficiary[];
    PersonalResidenceDevise?: boolean;
    back: string;
    next: string;
  }

  export interface IPersonalWithOtherResidence  extends IPersonalResidence{
    iSSpecificBequests?: boolean,
    Special_Benefits?: IRequests[],
  }
  