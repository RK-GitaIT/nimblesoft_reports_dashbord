export interface IRequests {
    bequestType: 'charity' | 'individual'; // Common field
    charityName?: string;
    charityCity?: string;
    charityState?: string;
    individualName?: string;
    effectiveDate?: string;
  
    // Fields specific to SpecificBequest
    itemType?: 'dollar' | 'physical' | 'item';
    amount?: number | null;
    itemDescription?: string;
  
    // Fields specific to NamedPersonBequest
    issueToTakeShare?: number | null;
    otherBeneficiariesToTakeShare?: number | null;
    alternateBeneficiaryName?: string;
    percentage?: number | null;
    expanded?:boolean;
  }
  