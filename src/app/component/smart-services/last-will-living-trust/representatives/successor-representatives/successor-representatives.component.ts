import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPersonalRepresentatives } from '../../../../../models/interfaces/utilities/IPersonalRepresentatives';
import { SuccessorsComponent } from "../../../utilities/successors/successors.component";
import { Beneficiary } from '../../../../../models/interfaces/Beneficiary.model';
import { ITrustOptions } from '../../../../../models/interfaces/utilities/ITrustOptions';

@Component({
  selector: 'app-successor-representatives',
  imports: [SuccessorsComponent],
  templateUrl: './successor-representatives.component.html',
  styleUrl: './successor-representatives.component.css'
})
export class SuccessorRepresentativesComponent implements OnInit, OnChanges {
    @Input() trust_data?: ITrustOptions | null;
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
  data_members: Beneficiary[] = [];

  selectedRepresentatives: Beneficiary[] = [];

  getColor(user: Beneficiary): string {
    return user.index % 2 === 0 ? 'bg-green-500' : 'bg-red-500';
  }

  handleSelectionChange(updatedReps: Beneficiary[]) {
    console.log('Updated Representatives:', updatedReps);
    this.selectedRepresentatives = updatedReps;
  }

}