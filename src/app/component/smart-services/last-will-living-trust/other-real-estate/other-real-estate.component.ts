import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPersonalWithOtherResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { RealEstateComponent } from "../../utilities/real-estate/real-estate.component";
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';
import { IRealEstateEntry } from '../../../../models/interfaces/utilities/IRealEstateEntry';

@Component({
  selector: 'app-other-real-estate',
  imports: [CommonModule, FormsModule, RealEstateComponent],
  templateUrl: './other-real-estate.component.html',
  styleUrl: './other-real-estate.component.css'
})
export class OtherRealEstateComponent implements OnInit {
  @Input() trust_data?: ITrustOptions | null;
  @Input() other_real_estate_Data?: IPersonalWithOtherResidence;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() other_real_estate_data_emit = new EventEmitter<IPersonalWithOtherResidence>(); 

  ngOnInit(): void {
    if (!this.other_real_estate_Data) return;
  
    if (!this.other_real_estate_Data.data) {
      this.other_real_estate_Data.data = {} as IRealEstateEntry;
    }

    if (!this.other_real_estate_Data.data.Beneficiary) {
      this.other_real_estate_Data.data.Beneficiary = this.other_real_estate_Data.Beneficiary || [];
    }
  }
  
  onBeneficiariesChange(updatedBeneficiaries: any[]) {
    console.log("My Real estate beneficieries",updatedBeneficiaries);
  }
  
  Back(): void {
    this.backClicked.emit(this.other_real_estate_Data?.back ?? '');
  }

  confirmToNext(): void {
    if (this.other_real_estate_Data) {
      this.other_real_estate_data_emit.emit(this.other_real_estate_Data);
      this.nextClicked.emit(this.other_real_estate_Data.next);
    }
  }
}
