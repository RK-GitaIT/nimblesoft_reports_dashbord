import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPersonalResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';
import { ResidueEstateComponent } from "../../utilities/residue-estate/residue-estate.component";


@Component({
  selector: 'app-personal-residence',
  imports: [ResidueEstateComponent],
  templateUrl: './personal-residence.component.html',
  styleUrl: './personal-residence.component.css'
})
export class PersonalResidenceComponent implements OnInit {
  @Input() personalResidenceData?: IPersonalResidence;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() personalResidenceData_emit = new EventEmitter<IPersonalResidence>(); 
  

  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
