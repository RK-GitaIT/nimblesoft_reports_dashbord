import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../finances.component'
import { SuccessorsComponent } from "../../utilities/successors/successors.component";

@Component({
  selector: 'app-finances-successor-representatives',
  imports: [CommonModule, FormsModule, SuccessorsComponent],
  templateUrl: './finances-successor-representatives.component.html',
  styleUrl: './finances-successor-representatives.component.css'
})
export class FinancesSuccessorRepresentativesComponent implements OnInit {

  // List of available agents passed from the parent.
  @Input() SuccessorAgent: Beneficiary[] = [];
  // The DocumentPrepareFor object holding the beneficiary and selected agents.
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;

  // Emit the selected (and ordered) agents when Next is clicked.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // Emit an event when Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();
  @Output() finish = new EventEmitter<'include' | 'exclude'>();

  ngOnInit(): void {
    console.log("Successor Agent Selector – Available Agents:", this.SuccessorAgent);
    console.log("Successor Agent Selector – DocumentPrepareFor:", this.DocumentPrepareFor);
  }
  selectedRepresentatives: Beneficiary[] = [];

  getColor(user: Beneficiary): string {
    return user.index % 2 === 0 ? 'bg-green-500' : 'bg-red-500';
  }

  handleSelectionChange(updatedReps: Beneficiary[]) {
    console.log('Updated Representatives:', updatedReps);
    this.selectedRepresentatives = updatedReps;
  }


  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    console.log('Selected  Representatives:',
      this.DocumentPrepareFor.SuccessorRepresentativesAgent
    );
    this.selectionConfirmed.emit(
      [...this.DocumentPrepareFor.SuccessorRepresentativesAgent]
    );
  }

  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor
      ? this.DocumentPrepareFor.SuccessorRepresentativesAgent
        .some(selected => selected.index === user.index)
      : false;
  }

  handleFinish(): void {
    if (!this.DocumentPrepareFor) return;
    // Store the user's choice in the DocumentPrepareFor object
    // Emit the chosen value to the parent
    this.finish.emit();
  }

}
