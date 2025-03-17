import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuccessorsComponent } from '../successors/successors.component';
import { AddBeneficieryComponent } from '../add-beneficiery/add-beneficiery.component';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';
import { IRequests } from '../../../../models/interfaces/utilities/IRequests';

@Component({
  selector: 'app-residue-estate',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessorsComponent, AddBeneficieryComponent],
  templateUrl: './residue-estate.component.html',
  styleUrl: './residue-estate.component.css'
})
export class ResidueEstateComponent {
onBeneficiariesChange($event: IRequests[]) {
throw new Error('Method not implemented.');
}
  @Input() trusteesOfJointRevocableData?: Beneficiary[];
  selectedRepresentatives: Beneficiary[] = [];


  selectedOption: string = '';
  omitChildren: string = '';
  descendantsTrust: string = '';
  trustOption: string = '';
  beneficiaries: any;
  total_members: any[] | undefined;
 

  getColor(user: Beneficiary): string {
    return user.index % 2 === 0 ? 'bg-green-500' : 'bg-red-500';
  }

  handleSelectionChange(updatedReps: Beneficiary[]) {
    console.log('Updated Representatives:', updatedReps);
    this.selectedRepresentatives = updatedReps;
  }
}
