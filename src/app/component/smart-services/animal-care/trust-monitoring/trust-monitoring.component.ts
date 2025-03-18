import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../animal-care.component';
import { AddBeneficieryComponent } from "../../utilities/add-beneficiery/add-beneficiery.component";
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';

@Component({
  selector: 'app-trust-monitoring',
  imports: [CommonModule, FormsModule, AddBeneficieryComponent],
  templateUrl: './trust-monitoring.component.html',
  styleUrl: './trust-monitoring.component.css'
})
export class TrustMonitoringComponent {
  onBeneficiariesChange(updatedBeneficiaries: any[]) {
    console.log("My Real estate beneficieries",updatedBeneficiaries);
  }

  @Input() DispositionAgent: Beneficiary[] = [];
  // The DocumentPrepareFor object holding the beneficiary and selected agents.
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  // Emit the selected (and ordered) agents when Next is clicked.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // Emit an event when Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();


  beneficiaries = [
    { type: 'individual', name: '', percentage: null, charityDetails: { name: '', city: '', state: '' } }
  ];


  addBeneficiary() {
    this.beneficiaries.push({
      type: 'individual',
      name: '',
      percentage: null,
      charityDetails: { name: '', city: '', state: '' }
    });
  }

  removeBeneficiary(index: number) {
    this.beneficiaries.splice(index, 1);
  }

  validatePercentage(percentage: number | null): boolean {
    return percentage !== null && !Number.isInteger(percentage);
  }


  successorType: string = 'equal';

  onSuccessorTypeChange(newVal: string): void {
    this.successorType = newVal;
    if (!this.DocumentPrepareFor) return;
    this.DocumentPrepareFor.dispositionFund = [];

  }



  // When Back is clicked.
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }



  // When Next is clicked, emit the selected surrogates.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    this.DocumentPrepareFor.dispositionFund = this.beneficiaries;
    this.selectionConfirmed.emit();

  }

}
