import { Beneficiary } from "../Beneficiary.model";

export interface IRequests {
    id?: number; // ✅ Added an ID field to track unique beneficiaries
    bequestType?: string;//'charity' | 'individual'; // Common field
    charityName?: string;
    charityCity?: string;
    charityState?: string;
    individualName?: string;
    effectiveDate?: string;
    beneficiary?: Beneficiary;
    percentage?: string;
    // Fields specific to SpecificBequest
    itemType?: string;
    amount?: number | null;
    itemDescription?: string;

    ownership_type?: string;
    effective_date?: string;
    takeShare?: boolean;  // ✅ New Field
    otherBeneficiaries?: boolean;  // ✅ New Field
    alternativeOption?: string;  // ✅ New Field

  }
  