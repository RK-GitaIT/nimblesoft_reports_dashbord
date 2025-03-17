import { Component, Input } from '@angular/core';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddBeneficieryComponent } from '../add-beneficiery/add-beneficiery.component';
import { IPersonalWithOtherResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';

interface RealEstateEntry {
  Beneficiary: IRequests[];
  ownershipType: string;
  Effective_date_of_devise: string;
  PersonalResidenceDevise: boolean;
  expanded: boolean; // Controls expand/collapse state
}

@Component({
  selector: 'app-real-estate',
  standalone: true,
  imports: [CommonModule, FormsModule, AddBeneficieryComponent],
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.css',
})
export class RealEstateComponent {
  @Input() real_estate_Data?: IPersonalWithOtherResidence;
  realEstateList: RealEstateEntry[] = [];

  ngOnInit(): void {
    console.log(this.real_estate_Data);
  }

  /** Adds a new real estate entry */
  addRealEstate() {
    this.realEstateList.push({
      Beneficiary: [],
      ownershipType: '',
      Effective_date_of_devise: '',
      PersonalResidenceDevise: false,
      expanded: true, // New entry starts expanded
    });
  }

  /** Removes a real estate entry */
  removeRealEstate(index: number) {
    this.realEstateList.splice(index, 1);
  }

  /** Toggles the expand/collapse state */
  toggleExpand(index: number) {
    this.realEstateList[index].expanded = !this.realEstateList[index].expanded;
  }

  /** Updates ownership type */
  updateOwnership(index: number, value: string) {
    this.realEstateList[index].ownershipType = value;
  }

  /** Updates effective date */
  updateEffectiveDate(index: number, value: string) {
    this.realEstateList[index].Effective_date_of_devise = value;
  }

  /** Updates beneficiaries */
  onBeneficiariesChange(index: number, updatedBeneficiaries: IRequests[]) {
    this.realEstateList[index].Beneficiary = updatedBeneficiaries;
  }
}
