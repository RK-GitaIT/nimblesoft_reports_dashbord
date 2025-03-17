import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProperty } from '../../../../models/interfaces/utilities/IProperty';
import { CommonModule } from '@angular/common';
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';

@Component({
  selector: 'app-property',
  imports: [CommonModule],
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  @Input() trust_data?: ITrustOptions | null;
  @Input() property_data?: IProperty;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();

  ngOnInit(): void {
  }

  Back(): void {
    this.backClicked.emit(this.property_data?.back ?? '');
  }

  confirmToNext(): void {
    if (this.property_data) {
      this.nextClicked.emit(this.property_data.next);
    }
  }
}
