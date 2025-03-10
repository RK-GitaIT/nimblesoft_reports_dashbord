import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-guardianship-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-guardianship-selector.component.html',
  styleUrls: ['./property-guardianship-selector.component.css']
})
export class PropertyGuardianshipSelectorComponent implements OnInit {
  
  @Input() actual_data_members: Beneficiary[] = [];
  @Input() selectedBeneficiary!: Beneficiary | null; // ✅ Receive selected beneficiary
  @Input() DocumentPrepareFor: { beneficiary: Beneficiary } | null = null;
  @Output() selectionConfirmed = new EventEmitter<{
    Executors: Beneficiary[],
    SuccessorExecutors: Beneficiary[],
    bequests: boolean
  }>();
  @Output() backClicked: EventEmitter<'initial' | 'executors' | 'representative' | 'finish'> = new EventEmitter();

 
  


  

  selectedExecutors: Beneficiary[] = [];
  selectedSuccessorExecutors: Beneficiary[] = [];
  selectedSingleSuccessor: Beneficiary | null = null;
  bequests: boolean | null = null;
  successorType: string = 'none'; // Default to "No Successor"

  ngOnInit(): void {}

  toggleExecutor(user: Beneficiary): void {
    this.toggleSelection(user, this.selectedExecutors);
  }

  toggleSuccessorExecutor(user: Beneficiary): void {
    this.toggleSelection(user, this.selectedSuccessorExecutors);
  }

  toggleSelection(user: Beneficiary, list: Beneficiary[]): void {
    const index = list.findIndex(selected => selected.index === user.index);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(user);
    }
  }

  selectSingleSuccessor(user: Beneficiary): void {
    this.selectedSingleSuccessor = user;
  }

  filteredSuccessors(): Beneficiary[] {
    return this.actual_data_members.filter(user => 
      !this.selectedExecutors.some(executor => executor.index === user.index)
    );
  }

  confirmSelection(): void {
    const successorList = this.successorType === 'one' ? 
      (this.selectedSingleSuccessor ? [this.selectedSingleSuccessor] : []) :
      this.selectedSuccessorExecutors;

    this.selectionConfirmed.emit({
      Executors: [...this.selectedExecutors],
      SuccessorExecutors: successorList,
      bequests: this.bequests!
    });
  }

  goBack(): void {
    this.backClicked.emit('initial'); // ✅ Emits only valid step values
  }
}
