import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPersonalResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';

@Component({
  selector: 'app-personal-residence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-residence.component.html',
  styleUrls: ['./personal-residence.component.css']
})
export class PersonalResidenceComponent implements OnInit {
  @Input() personalResidenceData?: IPersonalResidence;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() personalResidenceData_emit = new EventEmitter<IPersonalResidence>(); 

  ngOnInit(): void {
    // If no data is passed in, initialize with default values.
    if (!this.personalResidenceData) {
      this.personalResidenceData = {
        back: '',
        next: '',
        Beneficiary: [],
        ownershipType: '',
        Replacement_property: false,
        Effective_date_of_devise: '' // For the sole ownership scenario
      };
    }
  }

  /** Returns a concatenated string of beneficiary names for joint ownership. */
  get jointOwnersLabel(): string {
    if (!this.personalResidenceData?.Beneficiary) return '';
    return this.personalResidenceData.Beneficiary
      .map(b => b.firstName + ' ' + b.lastName)
      .join(' and ');
  }

  /** Checks if joint ownership is selected. */
  get isJointOwnership(): boolean {
    return this.personalResidenceData?.ownershipType === 'joint';
  }

  /** Returns the sole owner index if ownershipType starts with "sole_". */
  get soleOwnerIndex(): number | null {
    const ownership = this.personalResidenceData?.ownershipType || '';
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
    if (!this.personalResidenceData?.Beneficiary || this.soleOwnerIndex === null) {
      return '';
    }
    const ben = this.personalResidenceData.Beneficiary.find(
      b => b.index === this.soleOwnerIndex
    );
    return ben ? `${ben.firstName} ${ben.lastName}` : '';
  }

  /**
   * Returns a comma-separated list of all other beneficiaries' full names.
   * For example: "Hema Latha, John Doe"
   */
  get otherBeneficiariesNames(): string {
    if (!this.personalResidenceData?.Beneficiary || this.soleOwnerIndex === null) {
      return '';
    }
    const others = this.personalResidenceData.Beneficiary.filter(
      b => b.index !== this.soleOwnerIndex
    );
    return others.map(b => `${b.firstName} ${b.lastName}`).join(', ');
  }

  Back(): void {
    this.backClicked.emit(this.personalResidenceData?.back ?? '');
  }

  confirmToNext(): void {
    if (this.personalResidenceData) {
      this.personalResidenceData_emit.emit(this.personalResidenceData);
      this.nextClicked.emit(this.personalResidenceData.next);
    }
  }
}
