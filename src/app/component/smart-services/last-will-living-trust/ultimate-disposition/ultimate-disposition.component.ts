import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUltimateDisposition } from '../../../../models/interfaces/utilities/IUltimateDisposition';

@Component({
  selector: 'app-ultimate-disposition',
  imports: [CommonModule, FormsModule],
  templateUrl: './ultimate-disposition.component.html',
  styleUrl: './ultimate-disposition.component.css'
})
export class UltimateDispositionComponent implements OnInit {
  @Input() ultimate_disposition_data?: IUltimateDisposition;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() ultimate_disposition_data_emit = new EventEmitter<IUltimateDisposition>(); 

  ngOnInit(): void {
    // If no data is passed in, initialize with default values.
    if (!this.ultimate_disposition_data) {
      this.ultimate_disposition_data = {
        back: '',
        next: '',
        ultimate_beneficiary: '',
        beneficiary_Details: [],
      };
    }
  }

  Back(): void {
    this.backClicked.emit(this.ultimate_disposition_data?.back ?? '');
  }

  confirmToNext(): void {
    if (this.ultimate_disposition_data) {
      this.ultimate_disposition_data_emit.emit(this.ultimate_disposition_data);
      this.nextClicked.emit(this.ultimate_disposition_data.next);
    }
  }
}
