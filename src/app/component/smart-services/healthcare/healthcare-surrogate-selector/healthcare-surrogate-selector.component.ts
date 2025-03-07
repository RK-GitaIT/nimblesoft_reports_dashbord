import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { CommonModule } from '@angular/common';
import { DocumentPrepareFor } from '../healthcare.component';

@Component({
  selector: 'app-healthcare-surrogate-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './healthcare-surrogate-selector.component.html',
  styleUrls: ['./healthcare-surrogate-selector.component.css']
})
export class HealthcareSurrogateSelectorComponent implements OnInit {
  @Input() actual_data_members: Beneficiary[] = [];
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  // When Next is clicked, we emit the selected surrogates.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // When Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();

  // Local list if needed (for example, to filter out selected members)
  healthcareAgents: Beneficiary[] = [];

  ngOnInit(): void {
    console.log("Surrogate Selector – Loaded Members:", this.actual_data_members);
    console.log("Surrogate Selector – DocumentPrepareFor:", this.DocumentPrepareFor);
    // Initially assign the full list.
    this.healthcareAgents = this.actual_data_members;
  }

  // Toggle selection for a given user.
  toggleSelection(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;
    const index = this.DocumentPrepareFor.HealthcareSurrogateSelector.findIndex(
      selected => selected.index === user.index
    );
    if (index > -1) {
      this.DocumentPrepareFor.HealthcareSurrogateSelector.splice(index, 1);
    } else {
      this.DocumentPrepareFor.HealthcareSurrogateSelector.push(user);
    }
  }

  // When Next is clicked, emit the selected surrogates.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    // (Optional) update a local filtered list if needed.
    this.healthcareAgents = this.actual_data_members.filter(member =>
      !this.DocumentPrepareFor!.HealthcareSurrogateSelector.some(
        selected => selected.index === member.index
      )
    );
    console.log("Selected Surrogates:", this.DocumentPrepareFor.HealthcareSurrogateSelector);
    this.selectionConfirmed.emit([...this.DocumentPrepareFor.HealthcareSurrogateSelector]);
  }

  // When Back is clicked.
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  // Check if a user is selected.
  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor 
           ? this.DocumentPrepareFor.HealthcareSurrogateSelector.some(selected => selected.index === user.index)
           : false;
  }
}
