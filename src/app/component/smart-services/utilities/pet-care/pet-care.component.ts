import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPetForm } from '../../../../models/interfaces/utilities/IPetForm';

@Component({
  selector: 'app-pet-care',
  imports: [FormsModule, CommonModule],
  templateUrl: './pet-care.component.html',
  styleUrls: ['./pet-care.component.css']  
})
export class PetCareComponent {
  // Model for our pet care form
  petFormModel: IPetForm = {
    hasPets: false,
    createTrust: false,
    leaveMoney: false,
    assetType: '',
    incomeAsset: 0,
    assetDescription: '',
    next: '',
    back: ''
  };

  assetTypes = ['Dollar-amount', 'Income-producing asset'];

  @Input() petForm?: IPetForm;  
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() petData_emit = new EventEmitter<IPetForm>();

  // Getters to control conditional UI elements
  get showCreateTrust(): boolean {
    return this.petFormModel.hasPets;
  }

  get showLeaveMoney(): boolean {
    return this.showCreateTrust && this.petFormModel.createTrust;
  }

  get showAssetFields(): boolean {
    return this.showLeaveMoney && this.petFormModel.leaveMoney;
  }

  get isDollarAmount(): boolean {
    return this.petFormModel.assetType === 'Dollar-amount';
  }

  Back(): void {
    this.backClicked.emit(this.petForm?.back ?? '');
  }

  confirmToNext(): void {
    // Emit the current form model data
    this.petData_emit.emit(this.petFormModel);
    this.nextClicked.emit(this.petForm?.next ?? '');
  }
}
