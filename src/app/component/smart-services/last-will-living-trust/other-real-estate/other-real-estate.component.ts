import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPersonalWithOtherResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { AddBeneficieryComponent } from "../../utilities/add-beneficiery/add-beneficiery.component";
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';
import { RealEstateComponent } from "../../utilities/real-estate/real-estate.component";
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';

@Component({
  selector: 'app-other-real-estate',
  imports: [CommonModule, FormsModule, AddBeneficieryComponent, RealEstateComponent],
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
    // If no data is passed in, initialize with default values.
    if (!this.other_real_estate_Data) {
      this.other_real_estate_Data = {
        back: '',
        next: '',
        Beneficiary: [],
        ownershipType: '',
        Replacement_property: false,
        Effective_date_of_devise: '' // For the sole ownership scenario
      };
    }
  }
  onBeneficiariesChange(updatedBeneficiaries: any[]) {
    console.log("My Real estate beneficieries",updatedBeneficiaries);
  }
  /** Returns a concatenated string of beneficiary names for joint ownership. */
  get jointOwnersLabel(): string {
    if (!this.other_real_estate_Data?.Beneficiary) return '';
    return this.other_real_estate_Data.Beneficiary
      .map(b => b.firstName + ' ' + b.lastName)
      .join(' and ');
  }

  /** Checks if joint ownership is selected. */
  get isJointOwnership(): boolean {
    return this.other_real_estate_Data?.ownershipType === 'joint';
  }

  /** Returns the sole owner index if ownershipType starts with "sole_". */
  get soleOwnerIndex(): number | null {
    const ownership = this.other_real_estate_Data?.ownershipType || '';
    if (ownership.startsWith('sole_')) {
      return +ownership.split('_')[1];
    }
    return null;
  }

  /**
   * Returns the full name of the selected sole owner
   * (e.g. "Krishna Gautam" if ownershipType = "sole_2").
   */
  get selectedBeneficiaryName(): string {
    if (!this.other_real_estate_Data?.Beneficiary || this.soleOwnerIndex === null) {
      return '';
    }
    const ben = this.other_real_estate_Data.Beneficiary.find(
      b => b.index === this.soleOwnerIndex
    );
    return ben ? `${ben.firstName} ${ben.lastName}` : '';
  }

  /**
   * Returns a comma-separated list of all other beneficiaries' full names.
   * For example: "Hema Latha, John Doe"
   */
  get otherBeneficiariesNames(): string {
    if (!this.other_real_estate_Data?.Beneficiary || this.soleOwnerIndex === null) {
      return '';
    }
    const others = this.other_real_estate_Data.Beneficiary.filter(
      b => b.index !== this.soleOwnerIndex
    );
    return others.map(b => `${b.firstName} ${b.lastName}`).join(', ');
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
