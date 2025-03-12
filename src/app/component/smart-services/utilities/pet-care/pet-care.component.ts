import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, } from '@angular/forms';


interface TrustForm {
  hasPets: boolean;
  createTrust: boolean;
  leaveMoney: boolean;
  assetType?: string;
  incomeAsset?: number;
  assetDescription?: string;
}
@Component({
  selector: 'app-pet-care',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './pet-care.component.html',
  styleUrl: './pet-care.component.css'
})
export class PetCareComponent {
  trustForm: FormGroup;
  assetTypes = ['Dollar-amount', 'Income-producing asset'];

  constructor(private fb: FormBuilder) {
    this.trustForm = this.fb.group<TrustForm>({
      hasPets: false,
      createTrust: false,
      leaveMoney: false,
      assetType: '',
      incomeAsset: undefined,
      assetDescription: ''
    });
  }

  get showCreateTrust() {
    return this.trustForm.get('hasPets')?.value;
  }

  get showLeaveMoney() {
    return this.showCreateTrust && this.trustForm.get('createTrust')?.value;
  }

  get showAssetFields() {
    return this.showLeaveMoney && this.trustForm.get('leaveMoney')?.value;
  }

  get isDollarAmount() {
    return this.trustForm.get('assetType')?.value === 'Dollar-amount';
  }
}





