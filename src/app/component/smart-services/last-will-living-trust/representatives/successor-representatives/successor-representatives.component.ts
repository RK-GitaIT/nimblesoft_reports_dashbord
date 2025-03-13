import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPersonalRepresentatives } from '../../../../../models/interfaces/utilities/IPersonalRepresentatives';

@Component({
  selector: 'app-successor-representatives',
  imports: [],
  templateUrl: './successor-representatives.component.html',
  styleUrl: './successor-representatives.component.css'
})
export class SuccessorRepresentativesComponent implements OnInit, OnChanges {
  @Input() successorRepresentativesData?: IPersonalRepresentatives;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() successorRepresentativesDataEmit = new EventEmitter<IPersonalRepresentatives>(); 

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Respond to changes if needed
  }

  Back(): void {
    this.backClicked.emit(this.successorRepresentativesData?.back ?? '');
  }

  confirmToNext(): void {
    if (this.successorRepresentativesData) {
      this.successorRepresentativesDataEmit.emit(this.successorRepresentativesData);
      this.nextClicked.emit(this.successorRepresentativesData.next);
    }
  }

}