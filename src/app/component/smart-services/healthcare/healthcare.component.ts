import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LegalDocumentsService } from '../../../services/leagl_documents/leagl-documents.service';
import { myProfileService } from '../../../services/json/my-profile.service';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { HealthcareSurrogateSelectorComponent } from './healthcare-surrogate-selector/healthcare-surrogate-selector.component';
import { HealthcareSuccessorHealthcareAgentComponent } from './healthcare-successor-healthcare-agent/healthcare-successor-healthcare-agent.component';
import { HealthcareHipaaAuthorizationRepresentativesComponent } from './healthcare-hipaa-authorization-representatives/healthcare-hipaa-authorization-representatives.component';
import { HealthcareHipaaAuthorizationSuccessorRepresentativesComponent } from './healthcare-hipaa-authorization-successor-representatives/healthcare-hipaa-authorization-successor-representatives.component';
import { HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent } from './healthcare-hipaa-authorization-successor-psychotherapy-notes/healthcare-hipaa-authorization-successor-psychotherapy-notes.component';
import { Router } from '@angular/router';
import { HealthcarePdfFilesGenerationService } from '../../../services/healthcare/healthcare-pdf-files-generation.service';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  HealthcareSurrogateSelector: Beneficiary[];
  HealthcareSuccessorHealthcareAgents: Beneficiary[];
  HealthcareHipaaAuthorizationRepresentatives: Beneficiary[];
  HealthcareHipaaAuthorizationSuccessorRepresentatives: Beneficiary[];
  HealthcareHipaaAuthorizationPsychotherapyNotes?: 'include' | 'exclude';
}

@Component({
  selector: 'app-healthcare',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HealthcareSurrogateSelectorComponent,
    HealthcareSuccessorHealthcareAgentComponent,
    HealthcareHipaaAuthorizationRepresentativesComponent,
    HealthcareHipaaAuthorizationSuccessorRepresentativesComponent,
    HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent
  ],
  templateUrl: './healthcare.component.html',
  styleUrls: ['./healthcare.component.css']
})
export class HealthcareComponent implements OnInit {
  user: Beneficiary | null = null;
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  healthcareAgents: Beneficiary[] = [];

  currentStep: 'initial' | 'surrogate' | 'successor' | 'hipaa_authorization' | 'hipaa_successor' | 'hipaa_psychotherapy' | 'finish' = 'initial';

  // Backup properties to restore state if user cancels edit.
  backupSelectedUsers: DocumentPrepareFor | null = null;
  backupActualDataMembers: Beneficiary[] = [];

  constructor(
    private legalDocumentsService: LegalDocumentsService,
    private profileService: myProfileService,
    private router: Router, 
    private pdfgeneration: HealthcarePdfFilesGenerationService
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
            HealthcareSurrogateSelector: [],
            HealthcareSuccessorHealthcareAgents: [],
            HealthcareHipaaAuthorizationRepresentatives: [],
            HealthcareHipaaAuthorizationSuccessorRepresentatives: [],
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

  // Called when a beneficiary is clicked in the parent's Prepare_for_client list.
  selectUser(user: Beneficiary): void {
    this.DocumentPrepareFor = {
      beneficiary: user,
      HealthcareSurrogateSelector: [],
      HealthcareSuccessorHealthcareAgents: [],
      HealthcareHipaaAuthorizationRepresentatives: [],
      HealthcareHipaaAuthorizationSuccessorRepresentatives: []
    };
    // Remove the selected user from the list passed to the children.
    this.actual_data_members = this.total_members.filter(member => member.index !== user.index);
    console.log("Selected User:", this.DocumentPrepareFor);
  }

  // Called when Edit is clicked. Backup state and switch to surrogate selection.
  Edit(): void {
    this.backupSelectedUsers = this.DocumentPrepareFor ? { ...this.DocumentPrepareFor } : null;
    this.backupActualDataMembers = [...this.actual_data_members];
    this.currentStep = 'surrogate';
  }

  // Handler from HealthcareSurrogateSelectorComponent.
  handleSurrogateConfirmed(selectedSurrogates: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.HealthcareSurrogateSelector = selectedSurrogates;
      // Filter out the selected surrogates from the available list.
      this.healthcareAgents = this.actual_data_members.filter(member =>
        !this.DocumentPrepareFor!.HealthcareSurrogateSelector.some(
          selected => selected.index === member.index
        )
      );
    }
    this.currentStep = 'successor';
    console.log("Surrogate selection confirmed:", selectedSurrogates);
  }

  handleSurrogateCanceled(): void {
    if (this.backupSelectedUsers) {
      this.DocumentPrepareFor = this.backupSelectedUsers;
    }
    this.actual_data_members = [...this.backupActualDataMembers];
    this.currentStep = 'initial';
  }

  // Handler from HealthcareSuccessorHealthcareAgentComponent.
  handleSuccessorConfirmed(selectedSuccessors: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents = selectedSuccessors;
    }
    // Move on to HIPAA Authorization step.
    this.currentStep = 'hipaa_authorization';
    console.log("Successor selection confirmed:", selectedSuccessors);
  }

  handleSuccessorCanceled(): void {
    this.currentStep = 'surrogate';
  }

  // Handler from HealthcareHipaaAuthorizationRepresentativesComponent.
  handleHipaaConfirmed(selectedRepresentatives: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives = selectedRepresentatives;
    }
    // After HIPAA is confirmed, return to initial view (or proceed to assembly).
    this.currentStep = 'hipaa_successor';
    console.log("HIPAA Authorization confirmed:", selectedRepresentatives);
  }

  handleHipaaCanceled(): void {
    // Go back to the previous step, e.g. successor selection.
    this.currentStep = 'successor';
  }

  Assemble(): void {
    this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    console.log("Download PDF for:", this.DocumentPrepareFor);
    // Trigger your PDF generation logic here.
  }

  handleHipaaSuccessorConfirmed(selected: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = selected;
    }
    // Move to next step or go back to 'initial', etc.
    this.currentStep = 'hipaa_psychotherapy';
  }
  
  handleHipaaSuccessorCanceled(): void {
    // Revert or go back to previous step
    this.currentStep = 'successor';
  }

  handleHipaaPsychotherapyFinish(choice: 'include' | 'exclude'): void {
    console.log("User selected psychotherapy notes inclusion:", choice);
    // The child already updated DocumentPrepareFor, so we can proceed to next step or finalize
    this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    this.currentStep = 'finish'; // or whatever step you want
  }
  
  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }  
  
}
