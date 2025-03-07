export interface Beneficiary {
    index: number,
    firstName: string;
    lastName: string;
    dateOfBirth: string; 
    gender: 'Male' | 'Female' | 'Other'; 
    relationship: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    creationDate: string; 
  }
  