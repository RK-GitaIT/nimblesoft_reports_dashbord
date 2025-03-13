import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trust-option',
  imports: [CommonModule, FormsModule],
  templateUrl: './trust-option.component.html',
  styleUrls: ['./trust-option.component.css']
})
export class TrustOptionComponent implements OnInit, OnChanges {
  @Input() trust_data?: ITrustOptions | null;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() trust_data_emit = new EventEmitter<ITrustOptions>(); 

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Process changes if required
  }

  Back(): void {
    this.backClicked.emit(this.trust_data?.back ?? '');
  }

  confirmToNext(): void {
    if (this.trust_data) {
      this.trust_data_emit.emit(this.trust_data);
      this.nextClicked.emit(this.trust_data.next);
    }
  }
}
