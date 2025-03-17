import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';
import { IPersonalWithOtherResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';


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
  @Input() other_real_estate_Data?: IPersonalWithOtherResidence;
  selectedName: string = '';
  otherName: string ='';
  
  addBeneficiary() {
    const newBeneficiary: IRequests = {
      id: this.beneficiaries.length,
      bequestType: 'charity',
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      percentage: 0,
      itemType: 'dollar',
      amount: null,
      itemDescription: '',
      effectiveDate: '',
      expanded: true,   
    };

    this.beneficiaries.push(newBeneficiary);
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
  updateOwnership(index: number, value: string) {
    this.beneficiaries[index].ownershipType = value;
  }
  
  removeBeneficiary(index: number) {
    this.beneficiaries.splice(index, 1);
  }
 
  get isJointOwnership(): boolean {
    return this.other_real_estate_Data?.ownershipType === 'joint';
  }
  
  
 

}





