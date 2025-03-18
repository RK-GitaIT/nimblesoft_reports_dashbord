import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { DocumentPrepareFor } from '../animal-care.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.css'
})
export class MonitoringComponent {
  monitoring = {
    trusteeVisitsRequired: '',
    visitFrequency: ''
  };

  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;

  // Emit the selected (and ordered) agents when Next is clicked.
  @Output() selectionConfirmed = new EventEmitter<Beneficiary[]>();
  // Emit an event when Back is clicked.
  @Output() selectionCanceled = new EventEmitter<void>();


  
    // When Back is clicked.
    cancelSelection(): void {
      this.selectionCanceled.emit();
    }
  
   

    // When Next is clicked, emit the selected surrogates.
  confirmToNext(): void {
    if (!this.DocumentPrepareFor) return;
    this.DocumentPrepareFor.monitoring = { trusteeVisitsRequired: this.monitoring.trusteeVisitsRequired as "", visitFrequency: this.monitoring.visitFrequency as ""};   
    this.selectionConfirmed.emit();
 
  }
}
