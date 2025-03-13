import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuccessorsComponent } from '../successors/successors.component';
import { AddBeneficieryComponent } from '../add-beneficiery/add-beneficiery.component';
import { myProfileService } from '../../../../services/json/my-profile.service';
import { Beneficiary } from '../../../../models/interfaces/Beneficiary.model';

@Component({
  selector: 'app-residue-estate',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessorsComponent, AddBeneficieryComponent],
  templateUrl: './residue-estate.component.html',
  styleUrl: './residue-estate.component.css'
})
export class ResidueEstateComponent {
  selectedOption: string = '';
  omitChildren: string = '';
  descendantsTrust: string = '';
  trustOption: string = '';
  beneficiaries: any;
  total_members: any[] | undefined;
 
    constructor(private profileService: myProfileService) {}
   ngOnInit(): void {
      this.loadUsers();
    }
  
    //#region Initial component
  
    loadUsers(): void {
      this.profileService.getProfile().subscribe({
        next: (res) => {
          let indexCounter = 0;
         
  
          this.beneficiaries = Array.isArray(res?.beneficiaries)
            ? res.beneficiaries.map((ben: Beneficiary, i: number) => ({ ...ben, index: indexCounter++ }))
            : [];
  
          this.total_members = [...this.beneficiaries];
         
  
          
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
    }
}
