import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { IRealEstateEntry, RealEstateEntry } from '../../../../models/interfaces/utilities/IRealEstateEntry';
import { AddBeneficiaryComponent } from '../add-beneficiary/add-beneficiary.component';

@Component({
  selector: 'app-real-estate',
  standalone: true,
  imports: [CommonModule, FormsModule, AddBeneficiaryComponent],
  templateUrl: './real-estate.component.html',
  styleUrl: './real-estate.component.css',
})
export class RealEstateComponent implements OnInit {
  @Input() real_estate_data?: IRealEstateEntry | null;

  selectedBeneficiaryItem?: Beneficiary;
  Temp_beneficiary: Beneficiary[] = [];
  effectiveDate: string[] = [];
  // currentStage is used for adding a new property
  currentStage: RealEstateEntry = { address: '', Effective_date_of_devise: '', ownershipType: '', requests: [] };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (!this.real_estate_data || !this.real_estate_data.Beneficiary) return;

    // Map beneficiaries to include an index
    this.Temp_beneficiary = this.real_estate_data.Beneficiary.map((b, i) => ({
      ...b,
      index: i + 1,
    }));

    // If more than one beneficiary exists, create a joint record.
    if (this.real_estate_data.Beneficiary.length > 1) {
      const names = this.real_estate_data.Beneficiary.map(b => `${b.firstName} ${b.lastName}`);
      const jointName =
        names.length > 2
          ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
          : names.join(' and ');

      const jointData: Beneficiary = {
        index: 0,
        firstName: jointName,
        lastName: '',
        dateOfBirth: '',
        gender: 'Other',
        relationship: '',
        relationshipCategory: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        creationDate: '',
        isJointAccount: true,
      };

      this.real_estate_data = {
        ...this.real_estate_data,
        Beneficiary: [jointData, ...this.Temp_beneficiary],
      };
    }
  }

  /** Adds a new property to the list */
  addRealEstate() {
    if (!this.currentStage.address) {
      alert('Please enter the property address.');
      return;
    }
    if (!this.currentStage.ownershipType) {
      alert('Please select an owner.');
      return;
    }
    // Only require effective date if the selected beneficiary is NOT a joint account.
    if (!this.currentStage.Effective_date_of_devise && !this.selectedBeneficiaryItem?.isJointAccount) {
      alert('Please select an effective date.');
      return;
    }
    if (!this.real_estate_data?.EstateDetails) {
      this.real_estate_data!.EstateDetails = [];
    }
    this.real_estate_data?.EstateDetails?.push({ ...this.currentStage });
    this.resetForm();
    this.cdr.detectChanges();
  }

  /** Deletes a property with confirmation */
  deleteProperty(index: number) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.real_estate_data?.EstateDetails?.splice(index, 1);
    }
  }

  /** Called when a beneficiary is selected as owner */
  selectUser(data: Beneficiary) {
    this.selectedBeneficiaryItem = data;
    // For joint record, mark as 'Joint Ownership', otherwise use the beneficiary's name.
    this.currentStage.ownershipType = data.isJointAccount ? 'Joint Ownership' : `${data.firstName} ${data.lastName}`;
    this.effectiveDate = [];
    this.currentStage.Effective_date_of_devise = "";

    // If not a joint account, set effective date options.
    if (!data.isJointAccount && this.Temp_beneficiary.length > 1) {
      const name1 = `${data.firstName} ${data.lastName}`;
      const otherBeneficiary = this.Temp_beneficiary.find(a => a.index !== data.index);
      const name2 = otherBeneficiary ? `${otherBeneficiary.firstName} ${otherBeneficiary.lastName}` : 'another beneficiary';

      this.effectiveDate = [
        `At ${name1}'s death regardless of whether ${name2} is living`,
        `At ${name1}'s death only if ${name2} does not survive ${name1}`,
      ];
    }
    this.cdr.detectChanges();
  }

  /** Called when an effective date option is selected */
  selectEffectiveDate(option: string) {
    this.currentStage.Effective_date_of_devise = option;
  }

  /** Returns a color class based on the beneficiary's name */
  getUserColor(data: Beneficiary): string {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
    const index = (data.firstName.charCodeAt(0) + (data.lastName ? data.lastName.charCodeAt(0) : 0)) % colors.length;
    return colors[index];
  }

  /** Resets the add property form and selections */
  resetForm() {
    this.currentStage = { address: '', Effective_date_of_devise: '', ownershipType: '', requests: [] };
    this.selectedBeneficiaryItem = undefined;
  }
}
