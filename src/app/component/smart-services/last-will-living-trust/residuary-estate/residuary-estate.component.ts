import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResidueEstateComponent } from "../../utilities/residue-estate/residue-estate.component";
import { IPersonalRepresentatives } from '../../../../models/interfaces/utilities/IPersonalRepresentatives';
import { ITrustOptions } from '../../../../models/interfaces/utilities/ITrustOptions';

@Component({
  selector: 'app-residuary-estate',
  imports: [ResidueEstateComponent],
  templateUrl: './residuary-estate.component.html',
  styleUrl: './residuary-estate.component.css'
})
export class ResiduaryEstateComponent implements OnInit {
  @Input() trust_data?: ITrustOptions | null;
  @Input() residuaryEstateData?: IPersonalRepresentatives;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() residence_estate_data_emit = new EventEmitter<string>();

  ngOnInit(): void {
   
  }
  
  Back(): void {
    this.backClicked.emit(this.residuaryEstateData?.back);
  }

  confirmToNext(): void {
    this.residence_estate_data_emit.emit("hello");
    this.nextClicked.emit(this.residuaryEstateData?.next);
  }
}

