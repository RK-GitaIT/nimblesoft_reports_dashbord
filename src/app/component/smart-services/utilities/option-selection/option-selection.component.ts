import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { OptionSelectionData } from '../../../../models/interfaces/utilities/IOptionSelectionData';

@Component({
  selector: 'app-option-selection',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './option-selection.component.html',
  styleUrl: './option-selection.component.css'
})
export class OptionSelectionComponent implements OnInit {

  @Input() optionSelectionData!: OptionSelectionData;
  @Output() selectionConfirmed = new EventEmitter<string>();
  @Output() selectionCanceled = new EventEmitter<string>();
  @Output() selectedMembers = new EventEmitter<Beneficiary[]>

  selectionType: 'multiple' | 'one' | 'none' = 'multiple'; // Default selection type

  ngOnInit(): void {
    console.log('Option Selection Loaded:', this.optionSelectionData);
  }

  onSelectionTypeChange(newType: 'multiple' | 'one' | 'none'): void {
    this.selectionType = newType;

    if (newType === 'none') {
      this.optionSelectionData.selectedMembers = [];
    } else if (newType === 'one' && this.optionSelectionData.selectedMembers.length > 1) {
      this.optionSelectionData.selectedMembers = [this.optionSelectionData.selectedMembers[0]];
    }
  }

  toggleSelection(user: any): void {
    if (this.selectionType === 'none') return;

    if (this.selectionType === 'one') {
      this.optionSelectionData.selectedMembers = [user];
    } else {
      const index = this.optionSelectionData.selectedMembers.findIndex((selected) => selected.index === user.index);
      if (index > -1) {
        this.optionSelectionData.selectedMembers.splice(index, 1);
      } else {
        this.optionSelectionData.selectedMembers.push(user);
      }
    }
  }
  getUserColor(user: { firstName: string; lastName: string }): string {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = (user.firstName.charCodeAt(0) + user.lastName.charCodeAt(0)) % colors.length;
    return colors[index];
  }
  isSelected(user: any): boolean {
    return this.optionSelectionData.selectedMembers.some((selected) => selected.index === user.index);
  }

  confirmSelection(): void {
    this.selectionConfirmed.emit(this.optionSelectionData.next);
    this.selectedMembers.emit(this.optionSelectionData.selectedMembers);
  }

  cancelSelection(): void {
    this.selectionCanceled.emit(this.optionSelectionData.back);
  }
}
