import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentPrepareFor } from '../property-guardianship.component';

@Component({
  selector: 'app-property-guardianship-representatives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-guardianship-representatives.component.html',
  styleUrls: ['./property-guardianship-representatives.component.css']
})
export class PropertyGuardianshipRepresentativesComponent implements OnInit {
  
  @Input() actual_data_members: Beneficiary[] = [];
  @Input() DocumentPrepareFor: DocumentPrepareFor | null = null;


  @Output() selectionConfirmed = new EventEmitter<{
    dispositionOfResiduaryEstate: string,
    omitChildren: boolean,
    ultimateDispositionOfProperty: string
  }>();
  @Output() backClicked: EventEmitter<'executors'> = new EventEmitter();
  @Output() finish = new EventEmitter<void>(); // ✅ Emit Finish event

  dispositionOfResiduaryEstate = '';
  omitChildren: boolean | undefined = undefined;
  ultimateDispositionOfProperty = '';

  ngOnInit(): void {
    if (this.DocumentPrepareFor) {
      this.dispositionOfResiduaryEstate = this.DocumentPrepareFor.dispositionOfResiduaryEstate || '';
      this.omitChildren = this.DocumentPrepareFor.omitChildren ?? undefined; // ✅ Use undefined instead of null
      this.ultimateDispositionOfProperty = this.DocumentPrepareFor.ultimateDispositionOfProperty || '';
    }
}


  confirmAndFinish(): void {
    if (!this.DocumentPrepareFor) return;
    
    // Save selections into DocumentPrepareFor
    this.DocumentPrepareFor.dispositionOfResiduaryEstate = this.dispositionOfResiduaryEstate;
    this.DocumentPrepareFor.omitChildren = this.omitChildren!;
    this.DocumentPrepareFor.ultimateDispositionOfProperty = this.ultimateDispositionOfProperty;

    // Emit selection and finish process
    this.selectionConfirmed.emit({
      dispositionOfResiduaryEstate: this.dispositionOfResiduaryEstate,
      omitChildren: this.omitChildren!,
      ultimateDispositionOfProperty: this.ultimateDispositionOfProperty
    });

    this.finish.emit(); // ✅ Move to finish step
  }

  goBack(): void {
    this.backClicked.emit('executors'); // ✅ Emit back event
  }
}
