import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';


@Component({
  selector: 'app-add-beneficiery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-beneficiery.component.html',
  styleUrl: './add-beneficiery.component.css'
})
export class AddBeneficieryComponent {
  @Input() showBequest: boolean = false; // ✅ Controls Bequest visibility
  @Input() showEffectiveDate: boolean = false; // ✅ Controls Effective Date visibility
  @Input() beneficiaries: IRequests[] = []; // ✅ Directly accepts data from parent
  @Output() beneficiariesChange = new EventEmitter<IRequests[]>(); 

  addBeneficiary() {
    this.beneficiaries.push({
      bequestType: 'charity', // Default selection
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      percentage: null,
      itemType: 'dollar',
      amount: null,
      itemDescription: '',
      effectiveDate: '',
      expanded: true,
    });

    // ✅ Automatically save & emit updated list
    this.emitBeneficiaries();
}

private emitBeneficiaries() {
    console.log('Updated Beneficiary Data:', this.beneficiaries);
    this.beneficiariesChange.emit([...this.beneficiaries]);
}

toggleExpand(index: number) {
  this.beneficiaries[index].expanded = !this.beneficiaries[index].expanded;
  this.emitBeneficiaries();
}
  updateBeneficiary(index: number, field: keyof IRequests, value: any) {
    this.beneficiaries[index] = { ...this.beneficiaries[index], [field]: value };
  }

  removeBeneficiary(index: number) {
    this.beneficiaries.splice(index, 1);
  }
}





