import { Component, EventEmitter, Output } from '@angular/core';
import { Pet } from '../../../../models/interfaces/utilities/IPetDetails';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-pet',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-pet.component.html',
  styleUrl: './add-pet.component.css'
})
export class AddPetComponent {
  pets: Pet[] = [{ name: '', petType: '', otherPetType: '', breed: '', idNumber: '', expanded: false }];

  @Output() petsChange = new EventEmitter<Pet[]>(); // ✅ Explicitly specify type

  addPet() {
    const newPet: Pet = { name: '', petType: '', otherPetType: '', breed: '', idNumber: '', expanded: false };
    this.pets.push(newPet);
    this.emitPets(); 
  }

  removePet(index: number) {
    if (this.pets) {
      this.pets.splice(index, 1);
      this.emitPets();
    }
  }

  toggleExpand(index: number) {
    this.pets[index].expanded = !this.pets[index].expanded;
  }

  emitPets() {
    this.petsChange.emit([...this.pets]); // ✅ Emit correct type (Pet[])
  }
}

