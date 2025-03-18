import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../finances.component';
import { CommonModule } from '@angular/common';
import { SuccessorsComponent } from "../../utilities/successors/successors.component";

@Component({
  selector: 'app-finances-representative-agent',
  imports: [CommonModule, SuccessorsComponent],
  templateUrl: './finances-representative-agent.component.html',
  styleUrl: './finances-representative-agent.component.css'
})
export class FinancesRepresentativeAgentComponent  implements OnInit{
 @Input() actual_data_members: Beneficiary[] = [];
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  // When Next is clicked, we emit the selected surrogates.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // When Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();

  RepresentAgents: Beneficiary[] = [];

  selectedRepresentatives: Beneficiary[] = [];

  getColor(user: Beneficiary): string {
    return user.index % 2 === 0 ? 'bg-green-500' : 'bg-red-500';
  }

  handleSelectionChange(updatedReps: Beneficiary[]) {
    console.log('Updated Representatives:', updatedReps);
    this.selectedRepresentatives = updatedReps;
  }
  ngOnInit(): void {
    console.log("Representatives Selector – Loaded Members:", this.actual_data_members);
    console.log("Representatives Selector – DocumentPrepareFor:", this.DocumentPrepareFor);
    // Initially assign the full list.
   
  }

   // Toggle selection for a given user.
   toggleSelection(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;
    const index = this.DocumentPrepareFor.RepresentativesAgent.findIndex(
      selected => selected.index === user.index
    );
    if (index > -1) {
      this.DocumentPrepareFor.RepresentativesAgent.splice(index, 1);
    } else {
      this.DocumentPrepareFor.RepresentativesAgent.push(user);
    }
  }

  // When Next is clicked, emit the selected surrogates.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    // (Optional) update a local filtered list if needed.
    this.RepresentAgents = this.actual_data_members.filter(member =>
      !this.DocumentPrepareFor!.RepresentativesAgent.some(
        selected => selected.index === member.index
      )
    );
    console.log("Selected Representatives:", this.DocumentPrepareFor.RepresentativesAgent);
    this.selectionConfirmed.emit(this.selectedRepresentatives);
  }

  
  // When Back is clicked.
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  // Check if a user is selected.
  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor 
           ? this.DocumentPrepareFor.RepresentativesAgent.some(selected => selected.index === user.index)
           : false;
  }

}
