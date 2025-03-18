import { IRealEstateEntry } from "./IRealEstateEntry";
import { IRequests } from "./IRequests";

export interface IPersonalResidence extends IRealEstateEntry {
    data?:IRealEstateEntry;
    PersonalResidenceDevise: boolean;
    isReplacement_property?: boolean;
    back: string;
    next: string;
  }

  export interface IPersonalWithOtherResidence  extends IPersonalResidence{
    iSSpecificBequests?: boolean,
    Special_Benefits?: IRequests[],
  }
  