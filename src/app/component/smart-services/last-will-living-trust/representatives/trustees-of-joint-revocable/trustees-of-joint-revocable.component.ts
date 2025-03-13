import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPersonalRepresentatives } from '../../../../../models/interfaces/utilities/IPersonalRepresentatives';

@Component({
  selector: 'app-trustees-of-joint-revocable',
  imports: [],
  templateUrl: './trustees-of-joint-revocable.component.html',
  styleUrl: './trustees-of-joint-revocable.component.css'
})
export class TrusteesOfJointRevocableComponent implements OnInit, OnChanges {
  @Input() trusteesOfJointRevocableData?: IPersonalRepresentatives;
  @Output() backClicked = new EventEmitter<string>(); 
  @Output() nextClicked = new EventEmitter<string>();
  @Output() trusteesOfJointRevocableData_emit = new EventEmitter<IPersonalRepresentatives>(); 

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Respond to changes if needed
  }

  Back(): void {
    this.backClicked.emit(this.trusteesOfJointRevocableData?.back ?? '');
  }

  confirmToNext(): void {
    if (this.trusteesOfJointRevocableData) {
      this.trusteesOfJointRevocableData_emit.emit(this.trusteesOfJointRevocableData);
      this.nextClicked.emit(this.trusteesOfJointRevocableData.next);
    }
  }

}