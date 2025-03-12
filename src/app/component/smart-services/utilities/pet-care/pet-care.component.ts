import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface TrustForm {
  hasPets: boolean;
  createTrust: boolean;
  leaveMoney: boolean;
  assetType?: string;
  incomeAsset?: number;
  assetDescription?: string;
}
interface PetForm extends TrustForm {
  next: string;
  back: string;
}

@Component({
  selector: 'app-pet-care',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pet-care.component.html',
  styleUrls: ['./pet-care.component.css']  
})
export class PetCareComponent {
  trustForm: FormGroup;
  assetTypes = ['Dollar-amount', 'Income-producing asset'];
  @Input() petForm?: PetForm;  
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() petData = new EventEmitter<TrustForm>();

  constructor(private fb: FormBuilder) {
    this.trustForm = this.fb.group({
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

  Back(): void {
    this.backClicked.emit(this.petForm?.back ?? '');
  }

  confirmToNext(): void {
    this.petData.emit(this.trustForm.value as TrustForm);
    this.nextClicked.emit(this.petForm?.next ?? '');
  }
}
