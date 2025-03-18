import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPersonalResidence, IPersonalWithOtherResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { RealEstateEntry } from '../../../../models/interfaces/utilities/IRealEstateEntry';
import { AddBeneficiaryComponent } from '../../utilities/add-beneficiary/add-beneficiary.component';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';

@Component({
  selector: 'app-personal-residence',
  standalone: true,
  imports: [CommonModule, FormsModule, AddBeneficiaryComponent],
  templateUrl: './personal-residence.component.html',
  styleUrls: ['./personal-residence.component.css']
})
export class PersonalResidenceComponent implements OnInit {

  @Input() personalResidenceData: IPersonalWithOtherResidence = {
    Beneficiary: [],
    PersonalResidenceDevise: false,
    isReplacement_property: false,
    back: '',
    next: '',
    Special_Benefits:[],
    beneficiaries: []
  };

  @Input() trust_data?: ITrustOptions | null;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() personalResidenceData_emit = new EventEmitter<IPersonalWithOtherResidence>(); 

  selectedBeneficiaryItem?: Beneficiary;
  Temp_beneficiary: Beneficiary[] = [];
  effectiveDate: string[] = [];
  Decision_Date: string[] = ["No", "Yes"];
  selectedEffectiveDate?: string;
  currentStage?: RealEstateEntry;
  selectReplacement_property_data: string = "No";
  selectDecisionData: string = "No";

  ngOnInit(): void {
    if(this.personalResidenceData.Special_Benefits == null){
      this.personalResidenceData.Special_Benefits = [];
    }
    this.loadData();
    if (this.personalResidenceData.PersonalResidenceDevise === undefined) {
      this.personalResidenceData.PersonalResidenceDevise = false;
    }
  }

  Back(): void {
    this.backClicked.emit(this.personalResidenceData.back);
  }

  confirmToNext(): void {
    this.personalResidenceData_emit.emit({ ...this.personalResidenceData });
    this.nextClicked.emit(this.personalResidenceData.next);
  }

  loadData() {
    if (!this.personalResidenceData || !this.personalResidenceData.Beneficiary) return;

    this.Temp_beneficiary = this.personalResidenceData.Beneficiary.map((b, i) => ({
      ...b,
      index: i + 1,
    }));

    if (this.personalResidenceData.Beneficiary.length > 1) {
      const names = this.personalResidenceData.Beneficiary.map(b => `${b.firstName} ${b.lastName}`);
      const jointName = names.length > 2
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

      const updatedBeneficiaries = this.personalResidenceData.Beneficiary.map((b, i) => ({
        ...b,
        index: i + 1,
      }));

      this.personalResidenceData = {
        ...this.personalResidenceData,
        Beneficiary: [jointData, ...updatedBeneficiaries]
      };
    }
  }


  addRealEstate() {
    console.log("Adding real estate property...");
  }

  getUserColor(user: { firstName: string; lastName?: string }): string {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const firstChar = user.firstName.charCodeAt(0);
    const lastChar = user.lastName ? user.lastName.charCodeAt(0) : firstChar;
    const index = (firstChar + lastChar) % colors.length;
    return colors[index];
  }
  
  selectUser(data: Beneficiary) {
    this.selectedBeneficiaryItem = data;
    
    this.effectiveDate = [];

    if (!data.isJointAccount && this.Temp_beneficiary.length > 1) {
      const name1 = `${data.firstName} ${data.lastName}`;
      const otherBeneficiary = this.Temp_beneficiary.find(a => a.index !== data.index);
      const name2 = otherBeneficiary ? `${otherBeneficiary.firstName} ${otherBeneficiary.lastName}` : 'another beneficiary';
      this.effectiveDate = [
        `At ${name1}'s death regardless of whether ${name2} is living`,
        `At ${name1}'s death only if ${name2} does not survive ${name1}`
      ];
    }
    console.log("Effective Date Options:", this.effectiveDate);

  }
  
  selectEffectiveDate(option: string) {
    this.selectedEffectiveDate = option;
    // You may update any additional field if needed.
  }

  selectDecision(option: string) {
    console.log("Decision selected:", option);
    this.selectDecisionData = option;
    this.personalResidenceData.PersonalResidenceDevise = (option === "Yes");
  }

  selectReplacement_property(option: string) {
    console.log("Replacement property option:", option);
    this.selectReplacement_property_data = option;
    this.personalResidenceData.isReplacement_property = (option === "Yes");

     this.personalResidenceData_emit.emit(this.personalResidenceData);
  }

  updateBeneficiaries(updatedList: IRequests[]) {
    this.personalResidenceData.Special_Benefits = updatedList;
  }  

}
