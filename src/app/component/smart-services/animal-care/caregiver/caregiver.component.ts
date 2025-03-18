import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../animal-care.component';
import { SuccessorsComponent } from "../../utilities/successors/successors.component";

@Component({
  selector: 'app-caregiver',
  imports: [CommonModule, FormsModule, SuccessorsComponent],
  templateUrl: './caregiver.component.html',
  styleUrl: './caregiver.component.css'
})
export class CaregiverComponent {

    // List of available agents passed from the parent.
    @Input() CaregiverAgent: Beneficiary[] = [];
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
    this.selectedRepresentatives = updatedReps;
  }
  
    toggleSelection(user: Beneficiary): void {
      if (!this.DocumentPrepareFor) return;
  
 
      // If "one", we only keep zero or one
      
        const list = this.CaregiverAgent;
        if (list.length === 1) {
          const [existing] = list;
          // If clicking the same user, remove
          if (existing.index === user.index) {
            this.DocumentPrepareFor.caregiver = [];
          } else {
            // Otherwise replace with the new user
            this.DocumentPrepareFor.caregiver = [user];
          }
        } else {
          // If none or more than one, just set the array to the clicked user
          this.DocumentPrepareFor.caregiver = [user];
        }
        return;
       
    }
  
  
    confirmToNext(): void {
      if (!this.DocumentPrepareFor) return;
      console.log('Selected  Representatives:',
        this.DocumentPrepareFor.caregiver
      );
      this.selectionConfirmed.emit(
        [...this.DocumentPrepareFor.caregiver]
      );
    }
  
    cancelSelection(): void {
      this.selectionCanceled.emit();
    }
  
    isSelected(user: Beneficiary): boolean {
      return this.DocumentPrepareFor
        ? this.DocumentPrepareFor.caregiver
          .some(selected => selected.index === user.index)
        : false;
    }
  
}
