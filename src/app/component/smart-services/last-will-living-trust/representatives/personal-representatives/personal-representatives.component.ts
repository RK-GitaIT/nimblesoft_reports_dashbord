import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPersonalRepresentatives } from '../../../../../models/interfaces/utilities/IPersonalRepresentatives';
import { SuccessorsComponent } from "../../../utilities/successors/successors.component";
import { Beneficiary } from '../../../../../models/interfaces/Beneficiary.model';
import { ITrustOptions } from '../../../../../models/interfaces/utilities/ITrustOptions';
@Component({
  selector: 'app-personal-representatives',
  imports: [SuccessorsComponent],
  templateUrl: './personal-representatives.component.html',
  styleUrls: ['./personal-representatives.component.css']
})
export class PersonalRepresentativesComponent implements OnInit, OnChanges {
  @Input() trust_data?: ITrustOptions | null;
  @Input() personal_presentatives_data?: IPersonalRepresentatives;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() personal_presentatives_data_emit = new EventEmitter<IPersonalRepresentatives>(); 

  ngOnInit(): void {
   console.log(this.personal_presentatives_data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Respond to changes if needed
  }

  Back(): void {
    this.backClicked.emit(this.personal_presentatives_data?.back ?? '');
  }

  confirmToNext(): void {
    if (this.personal_presentatives_data) {
      this.personal_presentatives_data_emit.emit(this.personal_presentatives_data);
      this.nextClicked.emit(this.personal_presentatives_data.next);
    }
  }
  ///
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
