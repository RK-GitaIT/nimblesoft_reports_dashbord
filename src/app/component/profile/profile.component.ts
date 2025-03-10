import { Component, OnInit } from '@angular/core';
import { ProfilesCrudService } from '../../services/json/profiles-crud.service';
import { ToastService } from '../../services/toast.service'; // adjust the path as needed
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FamilyMember {
  beneficiaryId: number;
  firstName: string;
  lastName: string;
  fullLegalName: string;
  relationship: string;
  RelationshipCategory: string;
  dateOfBirth: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  clientId?: number;
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
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-orange-400',
    'bg-teal-400',
    'bg-indigo-400',
    'bg-rose-400'
  ];

  relationMapping: { [category: string]: { genderDependent: boolean, options: { Male?: string[], Female?: string[] } } } = {
    child: {
      genderDependent: false,
      options: { Male: ['son'], Female: ['daughter'] }
    },
    parent: {
      genderDependent: false,
      options: { Male: ['father'], Female: ['mother'] }
    },
    sibling: {
      genderDependent: false,
      options: { Male: ['brother', 'half-brother', 'stepbrother'], Female: ['sister', 'half-sister', 'stepsister'] }
    },
    spouse: {
      genderDependent: false,
      options: { Male: ['husband'], Female: ['wife'] }
    },
    other: {
      genderDependent: true,
      options: {
        Male: [
          'advisor', 'colleague', 'cousin', 'friend',
          'uncle', 'nephew', 'grandfather', 'grandson', 'godson',
          'mentor', 'neighbor', 'business associate', 'roommate'
        ],
        Female: [
          'advisor', 'colleague', 'cousin', 'friend',
          'aunt', 'niece', 'grandmother', 'granddaughter', 'goddaughter',
          'mentor', 'neighbor', 'business associate', 'roommate'
        ]
      }
    }
  };

  constructor(
    private profileCrud: ProfilesCrudService, 
    private fb: FormBuilder,
    private toastService: ToastService 
  ) {
    this.memberForm = this.fb.group({
      beneficiaryId: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullLegalName: [{ value: '', disabled: true }],
      RelationshipCategory: ['', Validators.required],
      relationship: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: [''],
      state: [''],
      city: [''],
      zipCode: [''],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]]
    });

    // Auto-update full legal name when firstName or lastName changes.
    this.memberForm.valueChanges.subscribe(values => {
      const fullName = `${values.firstName || ''} ${values.lastName || ''}`.trim();
      this.memberForm.patchValue({ fullLegalName: fullName }, { emitEvent: false });
    });
  }

  ngOnInit() {
    this.loadFamilyMembers();
    this.memberForm.get('RelationshipCategory')?.valueChanges.subscribe(value => {
      this.selectedRelation = value;
    });
    
  }

  getRelationshipOptions(): string[] {
    const category = this.memberForm.get('RelationshipCategory')?.value;
    if (!category) {
      return [];
    }
    this.selectedRelation  = category;
    const mapping = this.relationMapping[category];
    if (mapping) {
      if (mapping.genderDependent) {
        const gender = this.memberForm.get('gender')?.value as "Male" | "Female" | null;
        return gender && mapping.options[gender] ? mapping.options[gender]! : [];
      } else {
        const optionsMale = mapping.options.Male || [];
        const optionsFemale = mapping.options.Female || [];
        return Array.from(new Set([...optionsMale, ...optionsFemale]));
      }
    }
    return [];
  }

  loadFamilyMembers() {
    this.profileCrud.getAll().subscribe(data => {
      this.familyMembers = data
        .filter(member => member.clientId === 1)
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
    this.isDropdownOpen = false;
    this.memberForm.reset();
    const category = ['child', 'parent', 'sibling', 'spouse', 'other'].includes(relation.toLowerCase())
      ? relation.toLowerCase()
      : '';
    // Fix: Using the correct control name "RelationshipCategory"
    this.memberForm.patchValue({ RelationshipCategory: category, relationship: '' });
  }

  openEditPopup(beneficiaryId: number) {
    this.selectedMemberIndex = beneficiaryId;
    this.isEditPopupOpen = true;
    this.isPopupOpen = true;

    this.profileCrud.getByFileId(beneficiaryId).subscribe(member => {
      if (member) {
        const derivedCategory = this.deriveRelationCategory(member.relationship);
        this.memberForm.patchValue({
          beneficiaryId: member.beneficiaryId,
          firstName: member.firstName,
          lastName: member.lastName,
          fullLegalName: `${member.firstName} ${member.lastName}`,
          relationship: member.relationship,
          RelationshipCategory: derivedCategory,
          dateOfBirth: member.dateOfBirth.split('T')[0],
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
        this.toastService.showToast("Error", "No member found with the given ID", "error");
      }
    });
  }

  deriveRelationCategory(relationship: string): string {
    if (!relationship) return '';
    const lowerRel = relationship.toLowerCase();
    for (const category in this.relationMapping) {
      if (this.relationMapping[category].options.Male?.map(r => r.toLowerCase()).includes(lowerRel) ||
          this.relationMapping[category].options.Female?.map(r => r.toLowerCase()).includes(lowerRel)) {
        return category;
      }
    }
    return '';
  }

  closePopup() {
    this.isPopupOpen = false;
    this.isEditPopupOpen = false;
  }

  addMember() {
    if (this.memberForm.valid) {
      const newMember = {
        clientId: 1,
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
        Gender: this.memberForm.value.gender || null,
        RelationshipCategory: this.memberForm.value.RelationshipCategory || null
      };

      this.profileCrud.add(newMember).subscribe({
        next: (response) => {
          console.log("Beneficiary Added:", response);
          this.toastService.showToast("Success", "Beneficiary added successfully", "success");
          this.loadFamilyMembers();
          this.closePopup();
        },
        error: (err) => {
          console.error("Error adding beneficiary:", err);
          this.toastService.showToast("Error", "Failed to add beneficiary", "error");
        }
      });
    } else {
      this.showValidationErrors();
    }
  }

  updateMember() {
    if (this.selectedMemberIndex !== null && this.memberForm.valid) {
      const updatedMember = {
        clientId: 1,
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
        Gender: this.memberForm.value.gender || null,
        RelationshipCategory: this.memberForm.value.RelationshipCategory || null
      };

      this.profileCrud.update(updatedMember.BeneficiaryId, updatedMember).subscribe({
        next: (response) => {
          console.log("Beneficiary Updated:", response);
          this.toastService.showToast("Success", "Beneficiary updated successfully", "success");
          this.loadFamilyMembers();
          this.closePopup();
        },
        error: (err) => {
          console.error("Error updating beneficiary:", err);
          this.toastService.showToast("Error", "Failed to update beneficiary", "error");
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
        this.toastService.showToast("Success", "Beneficiary deleted successfully", "success");
        this.loadFamilyMembers();
      },
      error: (err) => {
        console.error("Error deleting beneficiary:", err);
        this.toastService.showToast("Error", "Failed to delete beneficiary", "error");
      }
    });
  }

  private showValidationErrors() {
    const invalidFields = Object.keys(this.memberForm.controls).filter(
      key => this.memberForm.controls[key].invalid
    );
    // Use ToastService to notify the user about validation errors
    this.toastService.showToast("Validation Error", "Please fill all required fields: " + invalidFields.join(", "), "warning", 5000);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getColor(name: string): string {
    if (!name) return this.colorPalette[0];
    const index = name.charCodeAt(0) % this.colorPalette.length;
    return this.colorPalette[index];
  }
}
