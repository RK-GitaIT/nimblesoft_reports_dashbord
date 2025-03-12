import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../healthcare.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-healthcare-hipaa-authorization-representatives',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './healthcare-hipaa-authorization-representatives.component.html',
  styleUrls: ['./healthcare-hipaa-authorization-representatives.component.css']
})
export class HealthcareHipaaAuthorizationRepresentativesComponent implements OnInit {
  @Input() actual_data_members: Beneficiary[] = [];
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  @Output() selectionCanceled = new EventEmitter<void>();
  @Input() getColor!: (user: any) => string; // Accept function from parent

  // Local copy of available agents.
  healthcareAgents: Beneficiary[] = [];

  ngOnInit(): void {
    console.log("HIPAA Auth Representatives – Loaded Members:", this.actual_data_members);
    console.log("HIPAA Auth Representatives – DocumentPrepareFor:", this.DocumentPrepareFor);
    // Assign the full list on init.
    this.healthcareAgents = this.actual_data_members;
  }

  // Toggle selection for a given user.
  toggleSelection(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;
    const index = this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives.findIndex(
      selected => selected.index === user.index
    );
    if (index > -1) {
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives.splice(index, 1);
    } else {
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives.push(user);
    }
  }

  // Emit the selected representatives when Next is clicked.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    console.log("Selected HIPAA Representatives:", this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives);
    this.selectionConfirmed.emit([...this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives]);
  }

  // Emit cancellation when Back is clicked.
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  // Check if a user is selected.
  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor 
           ? this.DocumentPrepareFor.HealthcareHipaaAuthorizationRepresentatives.some(selected => selected.index === user.index)
           : false;
  }
}
