import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model'; 
import { myProfileService } from '../../../services/json/my-profile.service';
import { FinancesRepresentativeAgentComponent } from './finances-representative-agent/finances-representative-agent.component';

import { FinancesSuccessorRepresentativesComponent } from './finances-successor-representatives/finances-successor-representatives.component';
import { Router } from '@angular/router';
import { FinancesService } from '../../../services/finances/finances.service';
import { generatePowerOfAttorneyPDF } from '../../../services/pdf_generator/Power_of_attorney';
import { powerofattorneyInstructionsPDF } from '../../../services/pdf_generator/Power_of_Attorney_Execution';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;  
  SuccessorRepresentativesAgent: Beneficiary[];
  RepresentativesAgent: Beneficiary[];  
}

@Component({
  selector: 'app-finances',
  imports: [  
    CommonModule,
    FormsModule ,FinancesRepresentativeAgentComponent,FinancesSuccessorRepresentativesComponent],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css'
})
export class FinancesComponent implements OnInit {
user: Beneficiary | null = null;
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' | 'representative' | 'successor' | 'finish' = 'initial';
  backupSelectedUsers: DocumentPrepareFor | null = null;
  backupActualDataMembers: Beneficiary[] = [];
  SuccessorAgent: Beneficiary[] = [];


 constructor(
    private profileService: myProfileService,
    private pdfgeneration: FinancesService,
       private router: Router, 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        let indexCounter = 0; 
        if (res) {
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
          ? res.beneficiaries.map((ben: Beneficiary, i: number) => ({ ...ben, index: indexCounter++ }))
          : [];
        // Combine user and beneficiaries into total_members.
        this.total_members = [...this.beneficiaries];
        if (this.user) {
          this.total_members.unshift(this.user);
        }
        // Filter for Prepare_for_client (e.g., Self or Spouse)
        this.Prepare_for_client = this.total_members.filter(a =>
          a.relationshipCategory && (a.relationshipCategory.includes("self") || a.relationshipCategory.includes("spouse"))
        );
        // Set default selection if available.
        if (this.Prepare_for_client.length > 0) {
          this.DocumentPrepareFor = {
            beneficiary: this.Prepare_for_client[0],   
            RepresentativesAgent : [],
            SuccessorRepresentativesAgent : [],
          };
        }
        // Initially, actual_data_members contains all members minus the selected beneficiary.
        this.actual_data_members = this.total_members.filter(member =>
          !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
        );
        console.log(this.Prepare_for_client, "Prepare_for_client Data");
        console.log(this.DocumentPrepareFor, "Default Selected User");
        console.log(this.total_members, "Total Members List");
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
  getUserColor(user: { firstName: string; lastName: string }): string {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = (user.firstName.charCodeAt(0) + user.lastName.charCodeAt(0)) % colors.length;
    return colors[index];
  }

  async Assemble(): Promise<void> {
    await generatePowerOfAttorneyPDF(this.DocumentPrepareFor?.beneficiary)
    await  powerofattorneyInstructionsPDF()
    this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    console.log("Download PDF for:", this.DocumentPrepareFor);
    // Trigger your PDF generation logic here.
  }
  
  // Called when a beneficiary is clicked in the parent's Prepare_for_client list.
  selectUser(user: Beneficiary): void {
    this.DocumentPrepareFor = {
      beneficiary: user,
      RepresentativesAgent : [],
      SuccessorRepresentativesAgent : [],
    };
    // Remove the selected user from the list passed to the children.
    this.actual_data_members = this.total_members.filter(member => member.index !== user.index);
    console.log("Selected User:", this.DocumentPrepareFor);
  }


  // Called when Edit is clicked. Backup state and switch to surrogate selection.
  Edit(): void {
    this.backupSelectedUsers = this.DocumentPrepareFor ? { ...this.DocumentPrepareFor } : null;
    this.backupActualDataMembers = [...this.actual_data_members];
    this.currentStep = 'representative';
  }
  
  // Handler from FinancesRepresentativeAgentComponent.
  handleRepresentativeAgent(selectedRepresentativesAgent: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.RepresentativesAgent = selectedRepresentativesAgent;      
      this.SuccessorAgent = this.actual_data_members.filter(
        member => !selectedRepresentativesAgent.some(
          selected => selected.index === member.index
        )
      );
      
    }
    this.currentStep = 'successor';
    console.log("Representatives selection confirmed:", selectedRepresentativesAgent);
  }

  handleRepresentativeAgentCanceled(): void {
    if (this.backupSelectedUsers) {
      this.DocumentPrepareFor = this.backupSelectedUsers;
    }
    this.actual_data_members = [...this.backupActualDataMembers];
    this.currentStep = 'initial';
  }

  handleSuccessorConfirmed(selectedSuccessors: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.SuccessorRepresentativesAgent = selectedSuccessors;
    }
    // Move on to HIPAA Authorization step.
    this.currentStep = 'successor';
    console.log("Successor selection confirmed:", selectedSuccessors);
  }

  
  handleSuccessorCanceled(): void {
    this.currentStep = 'representative';
  }

  handleFinish(): void {
    this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    this.currentStep = 'finish'; 
  }

  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }  

}

