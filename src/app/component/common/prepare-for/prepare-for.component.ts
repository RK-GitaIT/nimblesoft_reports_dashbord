import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DocumentPrepareFor } from '../../smart-services/animal-care/animal-care.component';
import { CommonModule } from '@angular/common';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
@Component({
  selector: 'app-prepare-for',
  imports: [CommonModule],
  templateUrl: './prepare-for.component.html',
  styleUrl: './prepare-for.component.css'
})
export class PrepareForComponent implements OnInit {
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  @Input() Prepare_for_client: Beneficiary[] = [];
  @Input() total_members: Beneficiary[] = [];
  @Input() actual_data_members: Beneficiary[] = [];

  ngOnInit(): void {
    console.log("Representatives Selector – Loaded Members:", this.Prepare_for_client);
    console.log("Representatives Selector – DocumentPrepareFor:", this.DocumentPrepareFor);
  }

  // Called when a beneficiary is clicked in the parent's Prepare_for_client list.
  selectUser(user: Beneficiary): void {
    this.DocumentPrepareFor = {
      beneficiary: user,
      pets:[],
      Successor: [],
      caregiver:[],
      monitoring:  { trusteeVisitsRequired: '', visitFrequency: '' }, 
      dispositionFund:[]
    };
    // Remove the selected user from the list passed to the children.
    this.actual_data_members = this.total_members.filter(member => member.index !== user.index);
    console.log("Selected User:", this.DocumentPrepareFor);
  }
  getUserColor(user: { firstName: string; lastName: string }): string {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = (user.firstName.charCodeAt(0) + user.lastName.charCodeAt(0)) % colors.length;
    return colors[index];
  }


}
