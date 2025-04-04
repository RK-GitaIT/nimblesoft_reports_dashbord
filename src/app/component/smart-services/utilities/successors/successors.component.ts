import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';

@Component({
  selector: 'app-successors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './successors.component.html',
  styleUrl: './successors.component.css'
})
export class SuccessorsComponent {
  
  @Input() data_members: Beneficiary[] | undefined = [];
  @Input() isChooseOption: Boolean = true;
  @Input() selectedRepresentatives: Beneficiary[] = [];
  @Output() representativesChange = new EventEmitter<Beneficiary[]>();
  @Input() successorType: String='multiple' // Default Selection

  @Input() getColor!: (user: Beneficiary) => string; // Function to determine color from parent
  /**
   * Handles dropdown changes and adjusts selection accordingly
   */
  onSuccessorTypeChange(newVal: string): void {
    this.successorType = newVal;
    if (this.successorType === 'none') {
      this.selectedRepresentatives = [];
    } else if (this.successorType === 'one' && this.selectedRepresentatives.length > 1) {
      this.selectedRepresentatives = [this.selectedRepresentatives[0]]; // Keep only the first
    }
    this.emitChanges();
  }

  /**
   * Toggle selection of a representative
   */
  toggleSelection(user: Beneficiary): void {
    if (this.successorType === 'none') return;

    if (this.successorType === 'one') {
      this.selectedRepresentatives = [user]; // Allow only one selection
    } else {
      const index = this.selectedRepresentatives.findIndex(rep => rep.index === user.index);
      if (index > -1) {
        this.selectedRepresentatives.splice(index, 1); // Remove if already selected
      } else {
        this.selectedRepresentatives.push(user); // Add if not selected
      }
    }
    this.emitChanges();
  }

  /**
   * Check if a user is selected
   */
  isSelected(user: Beneficiary): boolean {
    return this.selectedRepresentatives.some(rep => rep.index === user.index);
  }

  /**
   * Emit updated selection to parent
   */
  private emitChanges() {
    this.representativesChange.emit([...this.selectedRepresentatives]);
  }
}
