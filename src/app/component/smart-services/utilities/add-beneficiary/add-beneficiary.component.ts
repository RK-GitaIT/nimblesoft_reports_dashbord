import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.css']
})
export class AddBeneficiaryComponent implements OnInit {
  // Decision options for bequest type (Replacement Property)
  Decision_Date: string[] = ["Charity", "Individual"];
  // Options for request type (for model2/model6)
  Request_Type_Date: string[] = ["Dollar Amount", "Item"];
  
  // Default selections
  selectReplacement_property_data: string = "Charity";
  selectReplacement_request_data: string = "Dollar Amount";
  
  selectedBeneficiaryItem?: Beneficiary;
  effectiveDate: string[] = [];
  selectedEffectiveDate: string = "";
  
  // current_stage is our request model initialized with default values from IRequests
  current_stage: IRequests = {
    id: 0,
    bequestType: '',
    charityName: '',
    charityCity: '',
    charityState: '',
    individualName: '',
    effectiveDate: '',
    beneficiary: undefined,
    percentage: '',
    itemType: '',
    amount: null,
    itemDescription: '',
    ownership_type: '',
    effective_date: '',
    takeShare: undefined,
    otherBeneficiaries: undefined,
    alternativeOption: ''
  };
  alternativeOptions = ['Donate to Charity', 'Transfer to Estate', 'Reallocate to Other Heirs'];
  // Data provided from parent component
  @Input() providing_Data: IRequests[] = [];
  @Input() beneficiaries_Data: Beneficiary[] = [];
  @Input() showShare: Boolean =false;
  // typeofRequest determines which UI view to show; default is 'model1'
  @Input() typeofRequest: string = 'model1';

  @Output() providing_Data_emit = new EventEmitter<IRequests[]>();

  
  // Temporary beneficiaries list with index information
  Temp_beneficiary: Beneficiary[] = [];
  
  ngOnInit(): void {
    console.log(this.providing_Data)
    this.loadData();
  }
  
  // When a replacement property option is selected (Charity or Individual)
  selectReplacement_property(data: string) {
    this.selectReplacement_property_data = data;
    this.current_stage.bequestType = data;
  }
  updateTakeShare(value: boolean) {
    this.current_stage.takeShare = value;
    if (value) {
      this.current_stage.otherBeneficiaries = undefined;
      this.current_stage.alternativeOption = '';
    }
  }
  
  updateOtherBeneficiaries(value: boolean) {
    this.current_stage.otherBeneficiaries = value;
    if (value) {
      this.current_stage.alternativeOption = '';
    }
  }
  
  updateAlternativeOption(event: Event) {
    this.current_stage.alternativeOption = (event.target as HTMLSelectElement).value;
  }
  
  
  // When a request type option is selected (Dollar Amount or Item)
  selectReplacement_request(data: string) {
    this.selectReplacement_request_data = data;
    // Save selection to the model (itemType)
    this.current_stage.itemType = data;
    if (data === 'Dollar Amount') {
      this.current_stage.itemDescription = ''; // Clear item description if switching
    } else {
      this.current_stage.amount = null; // Clear amount if switching
    }
  }
  
  // Prepare beneficiaries data: add an index to each and, if more than one, create a joint record.
  loadData() {
    if (!this.beneficiaries_Data || this.beneficiaries_Data.length === 0) return;
  
    this.Temp_beneficiary = this.beneficiaries_Data.map((b, i) => ({
      ...b,
      index: i + 1,
    }));
  
    if (this.beneficiaries_Data.length > 1) {
      const names = this.beneficiaries_Data.map(b => `${b.firstName} ${b.lastName}`);
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
  
      const updatedBeneficiaries = this.beneficiaries_Data.map((b, i) => ({
        ...b,
        index: i + 1,
      }));
  
      this.beneficiaries_Data = [jointData, ...updatedBeneficiaries];
    }
  }
  
  // When a beneficiary is selected from the list
  selectUser(data: Beneficiary) {
    this.selectedBeneficiaryItem = data;
    this.effectiveDate = [];
  
    if (!data.isJointAccount && this.Temp_beneficiary.length > 1) {
      const name1 = `${data.firstName} ${data.lastName}`;
      // Save selected beneficiary's name in the model as individualName
      this.current_stage.individualName = name1;
      const otherBeneficiary = this.Temp_beneficiary.find(a => a.index !== data.index);
      const name2 = otherBeneficiary ? `${otherBeneficiary.firstName} ${otherBeneficiary.lastName}` : 'another beneficiary';
      this.effectiveDate = [
        `At ${name1}'s death regardless of whether ${name2} is living`,
        `At ${name1}'s death only if ${name2} does not survive ${name1}`
      ];
    }
    console.log("Effective Date Options:", this.effectiveDate);
  }
  
  // Returns a background color class based on the beneficiary's initials
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
  
  // When an effective date option is selected, update the model's effective_date
  selectEffectiveDate(option: string) {
    this.selectedEffectiveDate = option;
    this.current_stage.effective_date = option;
  }
  
  // Add the current request to the providing_Data array and then reset the form.
  addRequests() {
    this.current_stage.id = this.providing_Data.length + 1;
  
    // Append to array and emit updated data
    this.providing_Data = [...this.providing_Data, this.current_stage];
    this.providing_Data_emit.emit(this.providing_Data);
  
    // Reset form after adding request
    this.resetForm();
  }
  
  
  // Remove a request by filtering out the one with a matching id.
  RemoveRequests(data: IRequests) {
    const resdata = this.providing_Data.filter(r => r.id !== data.id);
    this.providing_Data = [...resdata];
  }
  
  // Reset the current request model and clear selections.
  resetForm() {
    this.current_stage = {
      id: 0,
      bequestType: '',
      charityName: '',
      charityCity: '',
      charityState: '',
      individualName: '',
      effectiveDate: '',
      beneficiary: undefined,
      percentage: '',
      itemType: '',
      amount: null,
      itemDescription: '',
      ownership_type: '',
      effective_date: ''
    };
    this.selectedBeneficiaryItem = undefined;
    this.selectedEffectiveDate = "";
  }
}
