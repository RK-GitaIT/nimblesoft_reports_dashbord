export interface IRequests {
    id?: number; // ✅ Added an ID field to track unique beneficiaries
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
    ownershipType?:string;
    issueToTakeShare?: number | null;
    otherBeneficiariesToTakeShare?: number | null;
    alternateBeneficiaryName?: string;
    percentage?: number | null;
    expanded?:boolean;
  }
  