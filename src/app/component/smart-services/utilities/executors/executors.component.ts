import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IExecutors } from '../../../../models/interfaces/utilities/IExecutors';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-executors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executors.component.html',
  styleUrls: ['./executors.component.css'] // fixed property name
})
export class ExecutorsComponent implements OnInit, OnChanges {
  @Input() executors_data?: IExecutors | null;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<void>();
  @Output() selectedUsers = new EventEmitter<Beneficiary[]>(); 

  selectedUserIndices: Set<number> = new Set<number>();

  ngOnInit() {
    this.setDefaultSelections();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['executors_data'] && this.executors_data) {
      this.setDefaultSelections();
    }
  }
  

  private setDefaultSelections(): void {
    this.selectedUserIndices.clear();
    this.executors_data?.members.forEach(member => {
      if (member.selected) {  
        this.selectedUserIndices.add(member.index);
      }
    });
  }

  Back(): void {
    this.backClicked.emit(this.executors_data?.back ?? '');
  }

  confirmToNext(): void {
    const selectedMembers = this.executors_data?.members.filter(member =>
      this.selectedUserIndices.has(member.index)
    ) || [];
    
    this.selectedUsers.emit(selectedMembers);
    this.nextClicked.emit();
  }

  toggleSelection(user: Beneficiary): void {
    if (this.selectedUserIndices.has(user.index)) {
      this.selectedUserIndices.delete(user.index);
    } else {
      this.selectedUserIndices.add(user.index);
    }
  }

  isSelected(user: Beneficiary): boolean {
    return this.selectedUserIndices.has(user.index);
  }
}

