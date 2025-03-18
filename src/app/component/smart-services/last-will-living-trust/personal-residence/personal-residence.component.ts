import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPersonalResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';


@Component({
  selector: 'app-personal-residence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-residence.component.html',
  styleUrls: ['./personal-residence.component.css']
})
export class PersonalResidenceComponent implements OnInit {
  @Input() trust_data?: ITrustOptions | null;
  @Input() personalResidenceData?: IPersonalResidence;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() personalResidenceData_emit = new EventEmitter<IPersonalResidence>(); 

  ngOnInit(): void {
  }


  Back(): void {
    this.backClicked.emit(this.personalResidenceData?.back ?? '');
  }

  confirmToNext(): void {
    if (this.personalResidenceData) {
      this.personalResidenceData_emit.emit(this.personalResidenceData);
      this.nextClicked.emit(this.personalResidenceData.next);
    }
  }
}
