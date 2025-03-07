import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../healthcare.component';

@Component({
  selector: 'app-healthcare-hipaa-authorization-successor-representatives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './healthcare-hipaa-authorization-successor-representatives.component.html',
  styleUrls: ['./healthcare-hipaa-authorization-successor-representatives.component.css']
})
export class HealthcareHipaaAuthorizationSuccessorRepresentativesComponent implements OnInit {

  @Input() data_members: Beneficiary[] = [];
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  @Output() selectionCanceled = new EventEmitter<void>();

  successorType: string = 'multiple';

  ngOnInit(): void {
    console.log('HIPAA Auth Representatives – Loaded Members:', this.data_members);
    console.log('HIPAA Auth Representatives – DocumentPrepareFor:', this.DocumentPrepareFor);
  }

  /**
   * Called whenever the dropdown changes. We automatically adjust the selection
   * array if "none" or "one" is chosen.
   */
  onSuccessorTypeChange(newVal: string): void {
    this.successorType = newVal;
    if (!this.DocumentPrepareFor) return;

    if (this.successorType === 'none') {
      // Clear any previously selected reps
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = [];
    } else if (this.successorType === 'one') {
      // If more than one was selected, keep only the first
      const selected = this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives;
      if (selected.length > 1) {
        this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = [selected[0]];
      }
    }
  }

  /**
   * Toggle selection of a user. Behavior depends on successorType:
   * - "multiple": standard toggle (add/remove)
   * - "one": only one user can be selected at a time
   * - "none": no one can be selected
   */
  toggleSelection(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;

    // If "none", ignore any clicks
    if (this.successorType === 'none') {
      return;
    }

    // If "one", we only keep zero or one
    if (this.successorType === 'one') {
      const list = this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives;
      if (list.length === 1) {
        const [existing] = list;
        // If clicking the same user, remove
        if (existing.index === user.index) {
          this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = [];
        } else {
          // Otherwise replace with the new user
          this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = [user];
        }
      } else {
        // If none or more than one, just set the array to the clicked user
        this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives = [user];
      }
      return;
    }

    // If "multiple", do the standard toggle
    const index = this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives
      .findIndex(selected => selected.index === user.index);

    if (index > -1) {
      // Already selected, remove
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives.splice(index, 1);
    } else {
      // Not yet selected, add
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives.push(user);
    }
  }

  /**
   * When Next is clicked, emit the final selection array
   */
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    console.log('Selected HIPAA Representatives:', 
      this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives
    );
    this.selectionConfirmed.emit(
      [...this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives]
    );
  }

  /**
   * When Back is clicked, emit a cancellation event
   */
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  /**
   * Returns true if the user is currently selected
   */
  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor 
      ? this.DocumentPrepareFor.HealthcareHipaaAuthorizationSuccessorRepresentatives
        .some(selected => selected.index === user.index)
      : false;
  }
}
