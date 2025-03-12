import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { IPrepareFor } from '../../../../models/interfaces/utilities/ipreparefor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preparefor',
  imports: [CommonModule],
  templateUrl: './preparefor.component.html',
  styleUrl: './preparefor.component.css'
})
export class PrepareforComponent {
  @Input() preparer_for?: IPrepareFor | null;

  @Output() editClicked = new EventEmitter<void>(); // Event to notify parent when "Edit" is clicked
  @Output() assembleClicked = new EventEmitter<void>(); // Event to notify parent when "Assemble" is clicked

  proceedToNextStep() {
    this.editClicked.emit(); // Notify parent that "Edit" was clicked
  }

  Assemble() {
    this.assembleClicked.emit(); // Notify parent that "Assemble" was clicked
  }
}