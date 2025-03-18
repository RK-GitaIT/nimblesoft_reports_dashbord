export interface Beneficiary {
    selected?: any;
    isJointAccount?: boolean;
    index: number,
    firstName: string;
    lastName: string;
    dateOfBirth: string; 
    gender: 'Male' | 'Female' | 'Other'; 
    relationship: string;
    relationshipCategory: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    creationDate: string; 
  }
  