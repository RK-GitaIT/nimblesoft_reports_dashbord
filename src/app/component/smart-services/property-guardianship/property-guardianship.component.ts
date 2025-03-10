import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LegalDocumentsService } from '../../../services/leagl_documents/leagl-documents.service';
import { myProfileService } from '../../../services/json/my-profile.service';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { PropertyGuardianshipSelectorComponent } from './property-guardianship-selector/property-guardianship-selector.component';
import { PropertyGuardianshipRepresentativesComponent } from './property-guardianship-representatives/property-guardianship-representatives.component';
import { Router } from '@angular/router';
import { HealthcarePdfFilesGenerationService } from '../../../services/healthcare/healthcare-pdf-files-generation.service';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  Executors: Beneficiary[];
  SuccessorExecutors: Beneficiary[];
  PropertyGuardianshipRepresentatives: Beneficiary[];
  bequests: boolean | null;
  dispositionOfResiduaryEstate: string;
  omitChildren: boolean | null;
  ultimateDispositionOfProperty: string;
}

@Component({
  selector: 'app-property-guardianship',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PropertyGuardianshipSelectorComponent,
    PropertyGuardianshipRepresentativesComponent
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

  currentStep: 'initial' | 'executors' | 'representative' | 'finish' = 'initial';

  constructor(
    private legalDocumentsService: LegalDocumentsService,
    private profileService: myProfileService,
    private router: Router,
    private pdfgeneration: HealthcarePdfFilesGenerationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  handleBack(previousStep: 'initial' | 'executors' | 'representative' | 'finish'): void { 
    this.currentStep = previousStep; // ✅ No more type error!
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
            relationship: 'Self',
            phoneNumber: res.phoneNumber ?? '',
            email: res.email ?? '',
            address: res.address ?? '',
            city: res.city ?? '',
            state: res.state ?? '',
            zipCode: res.zipCode ?? '',
            creationDate: res.creationDate ?? '',
          };
        }
        this.beneficiaries = Array.isArray(res?.beneficiaries)
          ? res.beneficiaries.map((ben: Beneficiary, i: number) => ({ ...ben, index: indexCounter++ }))
          : [];

        this.total_members = [...this.beneficiaries];
        if (this.user) {
          this.total_members.unshift(this.user);
        }

        this.Prepare_for_client = this.total_members.filter(a =>
          a.relationship && (a.relationship.includes("Self") || a.relationship.includes("Spouse"))
        );

        if (this.Prepare_for_client.length > 0) {
          this.DocumentPrepareFor = {
            beneficiary: this.Prepare_for_client[0],
            Executors: [],
            SuccessorExecutors: [],
            PropertyGuardianshipRepresentatives: [],
            bequests: null,
            dispositionOfResiduaryEstate: '',
            omitChildren: null,
            ultimateDispositionOfProperty: ''
          };
        }

        this.actual_data_members = this.total_members.filter(member =>
          !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
        );
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
  Assemble(): void {
    this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    console.log("Download PDF for:", this.DocumentPrepareFor);
    // Trigger your PDF generation logic here.
  }
  selectUser(user: Beneficiary): void {
    this.DocumentPrepareFor = {
      beneficiary: user,
      Executors: [],
      SuccessorExecutors: [],
      PropertyGuardianshipRepresentatives: [],
      bequests: null,
      dispositionOfResiduaryEstate: '',
      omitChildren: null,
      ultimateDispositionOfProperty: ''
    };

    this.actual_data_members = this.total_members.filter(member => member.index !== user.index);
  }

  proceedToNextStep(step: 'executors' | 'representative' | 'finish'): void {
    this.currentStep = step;
  }

  finalizeDocuments(): void {
    if (!this.DocumentPrepareFor) {
      console.error("No document data available.");
      return;
    }
    this.pdfgeneration.generatePdf(this.DocumentPrepareFor);
    this.currentStep = 'finish';
  }
  getBack(previousStep: 'executors' | 'initial'): void {
    this.currentStep = previousStep; // ✅ Correctly updates to the previous step
  }
  
  handleFinish(): void {
    console.log("Document process finished!");
    this.currentStep = 'finish'; // ✅ Move to the final step
  }
  
  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }
}
