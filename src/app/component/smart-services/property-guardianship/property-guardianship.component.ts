import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { myProfileService } from '../../../services/json/my-profile.service';
import { LastWillTrustService } from '../../../services/Lastwill_trust/last-will-trust.service';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';

/** 
 * Original interface for the first list of "Specific Bequests" 
 * (e.g., items or dollar amounts).
 */
export interface SpecificBequest {
  bequestType: 'charity' | 'individual';
  charityName: string;
  charityCity: string;
  charityState: string;
  individualName: string;
  itemType: 'dollar' | 'item';
  amount: number | null;
  itemDescription: string;
  effectiveDate: 'regardless' | 'notSurvive' | '';
}

export interface NamedPersonBequest {
  bequestType: 'charity' | 'individual';
  charityName: string;
  charityCity: string;
  charityState: string;
  individualName: string;
  issueToTakeShare: boolean | null;
  otherBeneficiariesToTakeShare: boolean | null;
  alternateBeneficiaryName: string;
  percentage: number | null;

  effectiveDate: 'regardless' | 'notSurvive' | '';
}


export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  Executors: Beneficiary[];
  SuccessorExecutors: Beneficiary[];
  PropertyGuardianshipRepresentatives: Beneficiary[];
  last_will: {
    successorType: string;
    bequests: boolean;
    dispositionOfResiduaryEstate: string;
    ultimateDispositionOfProperty: string;
    excludeChildrenShares: boolean;
    excludedChildren?: Beneficiary[];
    bequestsList?: SpecificBequest[];
    bequestsList2?: NamedPersonBequest[];
    Ultimate_Disposition_Beneficiaries?: NamedPersonBequest[];
    ultimateDispositionType?: any;
    child_name_1? : string;
    child_name_2? : string;
    Spouse_name?: string;
    name?: string;
  };
}

@Component({
  selector: 'app-property-guardianship',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './property-guardianship.component.html',
  styleUrls: ['./property-guardianship.component.css']
})
export class PropertyGuardianshipComponent implements OnInit {

  user: Beneficiary | null = null;
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' | 'executors' | 'representative' | 'Ultimate_Disposition' | 'finish' = 'initial';
  selectedExecutors: Beneficiary[] = [];
  selectedSingleSuccessor: Beneficiary | null = null;
  selectedSuccessorExecutors: Beneficiary[] = [];

  newBequest: SpecificBequest = {
    bequestType: 'charity',
    charityName: '',
    charityCity: '',
    charityState: '',
    individualName: '',
    itemType: 'dollar',
    amount: null,
    itemDescription: '',
    effectiveDate: ''
  };

  newBequest2: NamedPersonBequest = {
    bequestType: 'charity',
    charityName: '',
    charityCity: '',
    charityState: '',
    individualName: '',
    issueToTakeShare: null,
    otherBeneficiariesToTakeShare: null,
    alternateBeneficiaryName: '',
    percentage: null,
    effectiveDate: ''
  };

  constructor(
    private profileService: myProfileService,
    private router: Router,
    private lastwilltrus: LastWillTrustService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.updateLastWillTestament();
  }

  updateLastWillTestament(): void {
    if (!this.DocumentPrepareFor) return; 
    const spouseData = this.total_members.filter(
      member => member.index !== this.DocumentPrepareFor!.beneficiary.index &&
                (member.relationshipCategory.includes('spouse') ||  member.relationshipCategory.includes('self'))
    );
    this.DocumentPrepareFor.last_will.name = `${this.DocumentPrepareFor.beneficiary.firstName} ${this.DocumentPrepareFor.beneficiary.lastName}`;
    this.DocumentPrepareFor.last_will.Spouse_name = spouseData.length > 0 
      ? `${spouseData[0].firstName} ${spouseData[0].lastName}` 
      : '';
    this.DocumentPrepareFor.last_will.child_name_1 = this.DocumentPrepareFor.SuccessorExecutors[0]
      ? `${this.DocumentPrepareFor.SuccessorExecutors[0].firstName} ${this.DocumentPrepareFor.SuccessorExecutors[0].lastName}`
      : '';
    this.DocumentPrepareFor.last_will.child_name_2 = this.DocumentPrepareFor.SuccessorExecutors[1]
      ? `${this.DocumentPrepareFor.SuccessorExecutors[1].firstName} ${this.DocumentPrepareFor.SuccessorExecutors[1].lastName}`
      : '';
  }
  
  loadUsers(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        let indexCounter = 0;
        if (res) {
          // Build the main user object
          this.user = {
            index: indexCounter++,
            firstName: res.firstName ?? '',
            lastName: res.lastName ?? '',
            dateOfBirth: res.dateOfBirth ?? '',
            gender: (res.gender as 'Male' | 'Female' | 'Other') ?? 'Other',
            relationship: 'self',
            phoneNumber: res.phoneNumber ?? '',
            email: res.email ?? '',
            address: res.address ?? '',
            city: res.city ?? '',
            state: res.state ?? '',
            zipCode: res.zipCode ?? '',
            creationDate: res.creationDate ?? '',
            relationshipCategory: 'self',
          };
        }

        this.beneficiaries = Array.isArray(res?.beneficiaries)
          ? res.beneficiaries.map((ben: Beneficiary) => ({
              ...ben,
              index: indexCounter++
            }))
          : [];

        this.total_members = [...this.beneficiaries];
        if (this.user) {
          this.total_members.unshift(this.user);
        }

        this.Prepare_for_client = this.total_members.filter(a =>
          a.relationshipCategory &&
          (a.relationshipCategory.includes('self') || a.relationshipCategory.includes('spouse'))
        );

        if (this.Prepare_for_client.length > 0) {
          this.DocumentPrepareFor = {
            beneficiary: this.Prepare_for_client[0],
            Executors: [],
            SuccessorExecutors: [],
            PropertyGuardianshipRepresentatives: [],
            last_will: {
              successorType: 'none',
              bequests: false,
              dispositionOfResiduaryEstate: '',
              ultimateDispositionOfProperty: '',
              excludeChildrenShares: false,
              bequestsList: [],
              bequestsList2: []
            }
          };
        }

        if (this.DocumentPrepareFor) {
          this.actual_data_members = this.total_members.filter(
            member => member.index !== this.DocumentPrepareFor!.beneficiary.index
          );
          // Automatically update last will details
          this.updateLastWillTestament();
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  selectUser(user: Beneficiary): void {
    this.DocumentPrepareFor = {
      beneficiary: user,
      Executors: [],
      SuccessorExecutors: [],
      PropertyGuardianshipRepresentatives: [],
      last_will: {
        successorType: 'none',
        bequests: false,
        dispositionOfResiduaryEstate: '',
        ultimateDispositionOfProperty: '',
        excludeChildrenShares: false,
        excludedChildren: [],
        bequestsList: [],
        bequestsList2: []
      }
    };

    // Update "actual_data_members" to exclude the newly selected beneficiary
    this.actual_data_members = this.total_members.filter(
      member => member.index !== user.index
    );
  }

  /** Step Navigation */
  proceedToNextStep(step: 'executors' | 'representative' |  'Ultimate_Disposition' | 'finish'): void {
    this.currentStep = step;
  }

  goBack(): void {
    if (this.currentStep === 'executors') {
      this.currentStep = 'initial';
    } else if (this.currentStep === 'representative') {
      this.currentStep = 'executors';
    } else if (this.currentStep === 'Ultimate_Disposition') {
      this.currentStep = 'representative';
    } else if (this.currentStep === 'finish') {
      this.currentStep = 'representative';
    }
  }

  /** Confirm selection of Executors & Successors, move on to next step */
  confirmSelection(): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.Executors = this.selectedExecutors;
      if (this.DocumentPrepareFor.last_will.successorType === 'one' && this.selectedSingleSuccessor) {
        this.DocumentPrepareFor.SuccessorExecutors = [this.selectedSingleSuccessor];
      } else if (this.DocumentPrepareFor.last_will.successorType === 'multiple') {
        this.DocumentPrepareFor.SuccessorExecutors = this.selectedSuccessorExecutors;
      } else {
        this.DocumentPrepareFor.SuccessorExecutors = [];
      }
    }
    this.proceedToNextStep('representative');
  }

  confirmAndNext(data: any): void{
    this.proceedToNextStep(data);
  }

  /** Final step: load PDFs, move to "finish" */
  confirmAndFinish(): void {
    this.finalizeDocuments();
  }

  finalizeDocuments(): void {
    if (!this.DocumentPrepareFor) {
      console.error('No document data available.');
      return;
    }
    // Ensure the chosen executors are set
    this.DocumentPrepareFor.Executors = this.selectedExecutors;
    if (this.DocumentPrepareFor.last_will.successorType === 'one' && this.selectedSingleSuccessor) {
      this.DocumentPrepareFor.SuccessorExecutors = [this.selectedSingleSuccessor];
    } else if (this.DocumentPrepareFor.last_will.successorType === 'multiple') {
      this.DocumentPrepareFor.SuccessorExecutors = this.selectedSuccessorExecutors;
    } else {
      this.DocumentPrepareFor.SuccessorExecutors = [];
    }

    this.updateLastWillTestament();

    // Trigger PDF generation or any final logic
    this.lastwilltrus.load_PDFs(this.DocumentPrepareFor);
    this.currentStep = 'finish';
  }

  /** "Assemble" button in the 'initial' step */
  Assemble(): void {
    if (this.DocumentPrepareFor) {
      this.updateLastWillTestament();
      this.lastwilltrus.load_PDFs(this.DocumentPrepareFor);
      console.log('Download PDF for:', this.DocumentPrepareFor);
    }
  }

  /** Navigate to My Files */
  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }

  /** Toggle an executor in the "Executors" step */
  toggleExecutor(user: Beneficiary): void {
    const index = this.selectedExecutors.findIndex(exec => exec.index === user.index);
    if (index > -1) {
      this.selectedExecutors.splice(index, 1);
    } else {
      this.selectedExecutors.push(user);
    }
  }

  /** For "one" successor: select exactly one */
  selectSingleSuccessor(user: Beneficiary): void {
    this.selectedSingleSuccessor = user;
  }

  /** For "multiple" successors: toggle them on/off */
  toggleSuccessorExecutor(user: Beneficiary): void {
    const index = this.selectedSuccessorExecutors.findIndex(exec => exec.index === user.index);
    if (index > -1) {
      this.selectedSuccessorExecutors.splice(index, 1);
    } else {
      this.selectedSuccessorExecutors.push(user);
    }
  }

  /** Filter out the main beneficiary from the successor options */
  filteredSuccessors(): Beneficiary[] {
    return this.actual_data_members;
  }

  /**
   * First "Specific Bequests" list (bequestsList)
   * e.g., items or dollar amounts
   */
  addBequest(): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.bequestsList) {
      this.DocumentPrepareFor.last_will.bequestsList = [];
    }
    // Push a copy of newBequest
    this.DocumentPrepareFor.last_will.bequestsList.push({ ...this.newBequest });

    // Reset newBequest
    this.newBequest = {
      bequestType: 'charity',
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      itemType: 'dollar',
      amount: null,
      itemDescription: '',
      effectiveDate: ''
    };
  }

  removeBequest(index: number): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.bequestsList) return;
    this.DocumentPrepareFor.last_will.bequestsList.splice(index, 1);
  }

  /**
   * Second "Named Persons" list (bequestsList2)
   * e.g., beneficiaries with extra fields (issueToTakeShare, percentage, etc.)
   */
  addBequest2(): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.bequestsList2) {
      this.DocumentPrepareFor.last_will.bequestsList2 = [];
    }
    // Push a copy of newBequest2
    this.DocumentPrepareFor.last_will.bequestsList2.push({ ...this.newBequest2 });

    // Reset newBequest2
    this.newBequest2 = {
      bequestType: 'charity',
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      issueToTakeShare: null,
      otherBeneficiariesToTakeShare: null,
      alternateBeneficiaryName: '',
      percentage: null,
      effectiveDate: ''
    };
  }

  removeBequest2(index: number): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.bequestsList2) return;
    this.DocumentPrepareFor.last_will.bequestsList2.splice(index, 1);
  }

  toggleExcludedChild(user: Beneficiary): void {
    if (!this.DocumentPrepareFor?.last_will.excludedChildren) {
      this.DocumentPrepareFor!.last_will.excludedChildren = [];
    }
    const index = this.DocumentPrepareFor!.last_will.excludedChildren.findIndex(u => u.index === user.index);
    if (index > -1) {
      this.DocumentPrepareFor!.last_will.excludedChildren.splice(index, 1);
    } else {
      this.DocumentPrepareFor!.last_will.excludedChildren.push(user);
    }
  }
  
  isExcluded(user: Beneficiary): boolean {
    return !!this.DocumentPrepareFor?.last_will.excludedChildren?.some(u => u.index === user.index);
  }
  

  addBequest3(): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.Ultimate_Disposition_Beneficiaries) {
      this.DocumentPrepareFor.last_will.Ultimate_Disposition_Beneficiaries = [];
    }
    // Push a copy of newBequest2
    this.DocumentPrepareFor.last_will.Ultimate_Disposition_Beneficiaries.push({ ...this.newBequest2 });

    // Reset newBequest2
    this.newBequest2 = {
      bequestType: 'charity',
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      issueToTakeShare: null,
      otherBeneficiariesToTakeShare: null,
      alternateBeneficiaryName: '',
      percentage: null,
      effectiveDate: ''
    };
  }

  removeBequest3(index: number): void {
    if (!this.DocumentPrepareFor) return;
    if (!this.DocumentPrepareFor.last_will.Ultimate_Disposition_Beneficiaries) return;
    this.DocumentPrepareFor.last_will.Ultimate_Disposition_Beneficiaries.splice(index, 1);
  }
  
}
