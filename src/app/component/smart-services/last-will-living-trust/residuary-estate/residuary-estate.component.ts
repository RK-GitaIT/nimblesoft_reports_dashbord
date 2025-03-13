import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResidueEstateComponent } from "../../utilities/residue-estate/residue-estate.component";
import { IPersonalResidence } from '../../../../models/interfaces/utilities/IPersonalResidence';

@Component({
  selector: 'app-residuary-estate',
  imports: [ResidueEstateComponent],
  templateUrl: './residuary-estate.component.html',
  styleUrl: './residuary-estate.component.css'
})
export class ResiduaryEstateComponent implements OnInit {
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  Back(): void {
    this.backClicked.emit('personal-residence');
  }

  confirmToNext(): void {
    this.nextClicked.emit('initial');
  }
}

