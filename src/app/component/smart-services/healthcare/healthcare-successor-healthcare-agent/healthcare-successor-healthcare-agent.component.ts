import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../healthcare.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-healthcare-successor-healthcare-agent',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './healthcare-successor-healthcare-agent.component.html',
  styleUrls: ['./healthcare-successor-healthcare-agent.component.css']
})
export class HealthcareSuccessorHealthcareAgentComponent implements OnInit {
  // List of available agents passed from the parent.
  @Input() healthcareAgents: Beneficiary[] = [];
  // The DocumentPrepareFor object holding the beneficiary and selected agents.
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;
  
  // Emit the selected (and ordered) agents when Next is clicked.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // Emit an event when Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();

  ngOnInit(): void {
    console.log("Successor Agent Selector – Available Agents:", this.healthcareAgents);
    console.log("Successor Agent Selector – DocumentPrepareFor:", this.DocumentPrepareFor);
  }

  // Add an agent from the available list if not already selected.
  selectAgent(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;
    const exists = this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents.find(
      selected => selected.index === user.index
    );
    if (!exists) {
      this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents.push(user);
    }
  }

  // Remove an agent from the selected list.
  removeAgent(user: Beneficiary): void {
    if (!this.DocumentPrepareFor) return;
    const index = this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents.findIndex(
      selected => selected.index === user.index
    );
    if (index > -1) {
      this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents.splice(index, 1);
    }
  }

  // Handle drag–drop reordering of the selected list.
  drop(event: CdkDragDrop<Beneficiary[]>): void {
    if (!this.DocumentPrepareFor) return;
    moveItemInArray(
      this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents,
      event.previousIndex,
      event.currentIndex
    );
  }

  // When Next is clicked, emit the final ordered list of selected agents.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    console.log("Final Selected Successor Agents:", this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents);
    this.selectionConfirmed.emit([...this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents]);
  }

  // When Back is clicked, emit the cancellation event.
  cancelSelection(): void {
    this.selectionCanceled.emit();
  }

  // Returns true if the user is in the selected list.
  isSelected(user: Beneficiary): boolean {
    return this.DocumentPrepareFor 
      ? this.DocumentPrepareFor.HealthcareSuccessorHealthcareAgents.some(selected => selected.index === user.index)
      : false;
  }
}
