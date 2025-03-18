import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { myProfileService } from '../../../services/json/my-profile.service';
import { Router } from '@angular/router';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { PrepareForComponent } from '../../common/prepare-for/prepare-for.component';
import { PetDetailsComponent } from './pet-details/pet-details.component';
import { SuccessorComponent } from '../../common/successor/successor.component';
import { CaregiverComponent } from './caregiver/caregiver.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { UltimateDispositionComponent } from './ultimate-disposition/ultimate-disposition.component';
import { TrustMonitoringComponent } from './trust-monitoring/trust-monitoring.component';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  Successor: Beneficiary[];
  pets: any[];
  caregiver: Beneficiary[];
  monitoring: { trusteeVisitsRequired: '', visitFrequency: '' }
  dispositionFund: DispositionFund[];
}

export interface DispositionFund { 
  type: string; 
  name: string; 
  percentage: null; 
  charityDetails: { name: string; city: string; state: string }  // Change '' to string
}

export interface Monitoring {
  trusteeVisitsRequired: string,
  visitFrequency: string
}

@Component({
  selector: 'app-animal-care',
  imports: [CommonModule, FormsModule, PrepareForComponent, PetDetailsComponent, SuccessorComponent, CaregiverComponent, MonitoringComponent, UltimateDispositionComponent, TrustMonitoringComponent],
  templateUrl: './animal-care.component.html',
  styleUrl: './animal-care.component.css'
})
export class AnimalCareComponent implements OnInit {
  user: Beneficiary | null = null;
  beneficiaries: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' | 'pets' | 'successor' | 'caregiver' | 'Monitoring' | 'Disposition' | 'finish' = 'initial';
  backupSelectedUsers: DocumentPrepareFor | null = null;
  backupActualDataMembers: Beneficiary[] = [];
  SuccessorAgent: Beneficiary[] = [];
  CaregiverAgent: Beneficiary[] = [];
  DispositionAgent: Beneficiary[] = [];

  constructor(
    private profileService: myProfileService,
    private router: Router,
  ) { }

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

        // Initially, actual_data_members contains all members minus the selected beneficiary.
        this.actual_data_members = this.total_members.filter(member =>
          !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
        );

        // Set default selection if available.
        if (this.Prepare_for_client.length > 0) {
          this.DocumentPrepareFor = {
            beneficiary: this.Prepare_for_client[0],
            Successor: [],
            pets: [],
            caregiver: [],
            monitoring: { trusteeVisitsRequired: '', visitFrequency: '' },
            dispositionFund: []
          };
        }

        console.log(this.DocumentPrepareFor);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  Assemble(): void {
    // this.pdfgeneration.loadPdfs(this.DocumentPrepareFor);
    console.log("Download PDF for:", this.DocumentPrepareFor);
    // Trigger your PDF generation logic here.
  }

  // Called when Edit is clicked. Backup state and switch to surrogate selection.
  Edit(): void {
    this.backupSelectedUsers = this.DocumentPrepareFor ? { ...this.DocumentPrepareFor } : null;
    this.backupActualDataMembers = [...this.actual_data_members];
    this.currentStep = 'pets';
  }


  handleSuccessorConfirmed(selectedSuccessors: Beneficiary[]): void {
    if (this.DocumentPrepareFor) {
      this.DocumentPrepareFor.Successor = selectedSuccessors;
    }
    this.CaregiverAgent = this.actual_data_members.filter(member =>
      !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
    );
    // Move on to HIPAA Authorization step.
    this.currentStep = 'caregiver';
    console.log("Successor selection confirmed:", selectedSuccessors);
  }


  handleSuccessorCanceled(): void {
    this.currentStep = 'pets';
  }



  handlePetsConfirmed(selectedSuccessors: Beneficiary[]): void {
    this.SuccessorAgent = this.actual_data_members.filter(member =>
      !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
    );
    console.log("SuccessorAgent", this.SuccessorAgent);
    // Move on to HIPAA Authorization step.
    this.currentStep = 'successor';
    console.log("Successor selection confirmed:", selectedSuccessors);
  }
  handlePetsCanceled(): void {
    this.currentStep = 'initial';
  }

  handlecaregiverCanceled(): void {
    this.currentStep = 'successor';
  }
  handlecaregiverConfirmed(selectedSuccessors: Beneficiary[]): void {
    this.DispositionAgent = this.actual_data_members.filter(member =>
      !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
    );
    // Move on to HIPAA Authorization step.
    this.currentStep = 'Monitoring';
    console.log("Monitoring selection confirmed:", selectedSuccessors);
  }

  handleMonitoringCanceled(): void {
    this.currentStep = 'caregiver';
  }
  handleMonitoringConfirmed(): void {

    // Move on to HIPAA Authorization step.
    this.currentStep = 'Disposition';
  }

  handleTrustCanceled(): void {
    this.currentStep = 'Monitoring';
  }
  handleTrustConfirmed(): void {

    // Move on to HIPAA Authorization step.
    this.currentStep = 'finish';
  }

  handleDispositionCanceled(): void {
    this.currentStep = 'Disposition';
  }
  handleDispositionConfirmed(): void {

    this.goToMyFiles();
  }



  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }
}
