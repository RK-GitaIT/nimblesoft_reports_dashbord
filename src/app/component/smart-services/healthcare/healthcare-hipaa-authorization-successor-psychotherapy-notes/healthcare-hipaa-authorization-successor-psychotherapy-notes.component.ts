import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentPrepareFor } from '../healthcare.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-healthcare-hipaa-authorization-successor-psychotherapy-notes',
  imports: [FormsModule],
  templateUrl: './healthcare-hipaa-authorization-successor-psychotherapy-notes.component.html',
  styleUrl: './healthcare-hipaa-authorization-successor-psychotherapy-notes.component.css'
})
export class HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent implements OnInit  {
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;

  /** Emitted when the user clicks Finish. We send the chosen value ('include' or 'exclude'). */
  @Output() finish = new EventEmitter<'include' | 'exclude'>();

  /** The user's dropdown selection. Defaults to 'include'. */
  psychotherapyNotesChoice: 'include' | 'exclude' = 'include';

  ngOnInit(): void {
    // If the parent has a saved choice, load it
    if (this.DocumentPrepareFor?.HealthcareHipaaAuthorizationPsychotherapyNotes) {
      this.psychotherapyNotesChoice = this.DocumentPrepareFor.HealthcareHipaaAuthorizationPsychotherapyNotes;
    }
  }

  handleFinish(): void {
    if (!this.DocumentPrepareFor) return;
    // Store the user's choice in the DocumentPrepareFor object
    this.DocumentPrepareFor.HealthcareHipaaAuthorizationPsychotherapyNotes = this.psychotherapyNotesChoice;
    // Emit the chosen value to the parent
    this.finish.emit(this.psychotherapyNotesChoice);
  }
}
