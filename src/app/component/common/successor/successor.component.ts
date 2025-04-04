import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../../smart-services/animal-care/animal-care.component';
import { SuccessorsComponent } from "../../smart-services/utilities/successors/successors.component";

@Component({
  selector: 'app-successor',
  imports: [CommonModule, FormsModule, SuccessorsComponent],
  templateUrl: './successor.component.html',
  styleUrl: './successor.component.css'
})
export class SuccessorComponent implements OnInit {

  // List of available agents passed from the parent.
  @Input() SuccessorAgent: Beneficiary[] = [];
  // The DocumentPrepareFor object holding the beneficiary and selected agents.
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  // Emit the selected (and ordered) agents when Next is clicked.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // Emit an event when Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();
  selectedRepresentatives: Beneficiary[] = [];

  getColor(user: Beneficiary): string {
    return user.index % 2 === 0 ? 'bg-green-500' : 'bg-red-500';
  }

  handleSelectionChange(updatedReps: Beneficiary[]) {
    console.log('Updated Representatives:', updatedReps);
    this.DocumentPrepareFor? this.DocumentPrepareFor.Successor=updatedReps : []
    this.selectedRepresentatives = updatedReps;
  }

  ngOnInit(): void {
  console.log('SuccessorAgent -' ,this.SuccessorAgent);
  }



  successorType: string = 'multiple';

  onSuccessorTypeChange(newVal: string): void {
    this.successorType = newVal;
    if (!this.DocumentPrepareFor) return;

    if (this.successorType === 'none') {
      // Clear any previously selected reps
      this.DocumentPrepareFor.Successor = [];
    } else if (this.successorType === 'one') {
      // If more than one was selected, keep only the first
      const selected = this.DocumentPrepareFor.Successor;
      if (selected.length > 1) {
        this.DocumentPrepareFor.Successor = [selected[0]];
      }
    }
  }

  toggleSelection(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;

    // If "none", ignore any clicks
    if (this.successorType === 'none') {
      return;
    }

    // If "one", we only keep zero or one
    if (this.successorType === 'one') {
      const list = this.DocumentPrepareFor.Successor;
      if (list.length === 1) {
        const [existing] = list;
        // If clicking the same user, remove
        if (existing.index === user.index) {
          this.DocumentPrepareFor.Successor = [];
        } else {
          // Otherwise replace with the new user
          this.DocumentPrepareFor.Successor = [user];
        }
      } else {
        // If none or more than one, just set the array to the clicked user
        this.DocumentPrepareFor.Successor = [user];
      }
      return;
    }

    // If "multiple", do the standard toggle
    const index = this.DocumentPrepareFor.Successor
      .findIndex(selected => selected.index === user.index);

    if (index > -1) {
      // Already selected, remove
      this.DocumentPrepareFor.Successor.splice(index, 1);
    } else {
      // Not yet selected, add
      this.DocumentPrepareFor.Successor.push(user);
    }
  }


  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    console.log('Selected  Representatives:', this.DocumentPrepareFor.Successor
    );
    this.selectionConfirmed.emit(
      [...this.DocumentPrepareFor.Successor]
    );
  }

  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor
      ? this.DocumentPrepareFor.Successor
        .some(selected => selected.index === user.index)
      : false;
  }
}
