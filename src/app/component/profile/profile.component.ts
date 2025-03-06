import { Component, OnInit } from '@angular/core';
import { ProfilesCrudService } from '../../services/json/profiles-crud.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FamilyMember {
  beneficiaryId: number;
  firstName: string;
  lastName: string;
  fullLegalName: string;
  relationship: string;
  dateOfBirth: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  familyMembers: FamilyMember[] = [];
  isPopupOpen = false;
  isDropdownOpen = false;
  isEditPopupOpen = false;
  selectedRelation = '';
  selectedMemberIndex: number | null = null;

  memberForm: FormGroup;
  colorPalette = [
    'bg-red-400',    // Light Red
    'bg-blue-400',   // Light Blue
    'bg-green-400',  // Light Green
    'bg-yellow-400', // Light Yellow
    'bg-purple-400', // Light Purple
    'bg-pink-400',   // Light Pink
    'bg-orange-400', // Light Orange
    'bg-teal-400',   // Light Teal
    'bg-indigo-400', // Light Indigo
    'bg-rose-400'    // Light Rose
  ];

  constructor(private profileCrud: ProfilesCrudService, private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      beneficiaryId: [null], // Unique identifier
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullLegalName: [{ value: '', disabled: true }],  // ✅ Add fullLegalName & disable editing
      relationship: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: [''],
      state: [''],
      city: [''],
      zipCode: [''],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]], // Ensure 10-digit phone number
      email: ['', [Validators.email]]
    });
    

    // Auto-update full name when firstName or lastName changes
    this.memberForm.valueChanges.subscribe(values => {
      const fullName = `${values.firstName || ''} ${values.lastName || ''}`.trim();
      this.memberForm.patchValue({ fullLegalName: fullName }, { emitEvent: false });
    });
  }

  ngOnInit() {
    this.loadFamilyMembers();
  }

  loadFamilyMembers() {
    this.profileCrud.getAll().subscribe(data => {
      this.familyMembers = data
        .filter(member => member.clientId === 1) // ✅ Get only clientId = 1
        .map(member => ({
          ...member,
          fullLegalName: `${member.firstName} ${member.lastName}`.trim()
        }));
    });
  }
  
 
  openPopup(relation: string) {
    this.selectedRelation = relation;
    this.isPopupOpen = true;
    this.isEditPopupOpen = false;
    this.toggleDropdown();
    this.memberForm.reset();
    this.memberForm.patchValue({ relationship: relation }); // ✅ Set Relationship
  }
  getColor(name: string): string {
    const index = name.charCodeAt(0) % this.colorPalette.length; // Hashing based on first letter
    return this.colorPalette[index];
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openEditPopup(beneficiaryId: number) {
    this.selectedMemberIndex = beneficiaryId;
    this.isEditPopupOpen = true;
    this.isPopupOpen = true;

    this.profileCrud.getByFileId(beneficiaryId).subscribe(member => {
      if (member) {
        this.memberForm.patchValue({
          beneficiaryId: member.beneficiaryId,
          firstName: member.firstName,
          lastName: member.lastName,
          fullLegalName:member.firstName + member.lastName,
          relationship: member.relationship,
          dateOfBirth: member.dateOfBirth.split('T')[0], // ✅ Convert API Date to `YYYY-MM-DD`
          gender: member.gender,
          address: member.address,
          state: member.state,
          city: member.city,
          zipCode: member.zipCode,
          phoneNumber: member.phoneNumber,
          email: member.email
        });
      } else {
        console.warn("No member found with ID:", beneficiaryId);
      }
    });
  }

  closePopup() {
    this.isPopupOpen = false;
    this.isEditPopupOpen = false;
  }

  addMember() {
    if (this.memberForm.valid) {
      const newMember = {
        clientId:"1",
        FirstName: this.memberForm.value.firstName,
        LastName: this.memberForm.value.lastName,
        Relationship: this.memberForm.value.relationship,
        DateOfBirth: this.memberForm.value.dateOfBirth,
        Address: this.memberForm.value.address || null,
        State: this.memberForm.value.state || null,
        City: this.memberForm.value.city || null,
        ZipCode: this.memberForm.value.zipCode || null,
        PhoneNumber: this.memberForm.value.phoneNumber || null,
        Email: this.memberForm.value.email || null,
        Gender: this.memberForm.value.gender || null
      };

      this.profileCrud.add(newMember).subscribe({
        next: (response) => {
          console.log("Beneficiary Added:", response);
          this.loadFamilyMembers(); // ✅ Refresh List
          this.closePopup();
        },
        error: (err) => {
          console.error("Error adding beneficiary:", err);
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  updateMember() {
    if (this.selectedMemberIndex !== null && this.memberForm.valid) {
      const updatedMember = {
        clientId:"1",
        BeneficiaryId: this.memberForm.value.beneficiaryId,
        FirstName: this.memberForm.value.firstName,
        LastName: this.memberForm.value.lastName,
        Relationship: this.memberForm.value.relationship,
        DateOfBirth: this.memberForm.value.dateOfBirth,
        Address: this.memberForm.value.address || null,
        State: this.memberForm.value.state || null,
        City: this.memberForm.value.city || null,
        ZipCode: this.memberForm.value.zipCode || null,
        PhoneNumber: this.memberForm.value.phoneNumber || null,
        Email: this.memberForm.value.email || null,
        Gender: this.memberForm.value.gender || null
      };

      this.profileCrud.update(updatedMember.BeneficiaryId, updatedMember).subscribe({
        next: (response) => {
          console.log("Beneficiary Updated:", response);
          this.loadFamilyMembers(); // ✅ Refresh List
          this.closePopup();
        },
        error: (err) => {
          console.error("Error updating beneficiary:", err);
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  deleteMember(beneficiaryId: number) {
    this.profileCrud.delete(beneficiaryId).subscribe({
      next: () => {
        console.log(`Beneficiary ID ${beneficiaryId} deleted.`);
        this.loadFamilyMembers(); // ✅ Refresh List
      },
      error: (err) => {
        console.error("Error deleting beneficiary:", err);
      }
    });
  }

  private showValidationErrors() {
    const invalidFields = Object.keys(this.memberForm.controls).filter(
      key => this.memberForm.controls[key].invalid
    );
    alert("Please fill all required fields: " + invalidFields.join(", "));
  }
}
