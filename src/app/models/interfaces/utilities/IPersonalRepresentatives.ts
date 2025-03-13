import { Beneficiary } from "../Beneficiary.model";

export interface IPersonalRepresentatives {
  members?: Beneficiary[];
  sleeted_members?: Beneficiary[];
  back: string;
  next: string;
}
