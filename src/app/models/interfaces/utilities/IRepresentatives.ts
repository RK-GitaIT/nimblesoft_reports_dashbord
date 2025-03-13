import { Beneficiary } from "../Beneficiary.model";

export interface IRepresentatives {
      user?: Beneficiary,
      members?: Beneficiary[],
      title?: string;
      title2?: string;
      back : string;
      next: string;
}