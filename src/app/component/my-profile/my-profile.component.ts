import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { myProfileService } from '../../services/json/my-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Import ReactiveFormsModule
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  myProfileForm: FormGroup;
  currentStep: number = 1; // 1 -> Profile Info, 2 -> Address Info
  profileCrud: any;
  familyMembers: any;
  profileName:string ='';

  constructor(private myProfileService: myProfileService, private fb: FormBuilder) {
    this. myProfileForm = this.fb.group({
      ClientId: [null], // ✅ Store client ID
      fullLegalName: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  
    
  }
  ngOnInit() {
    this.loadProfile();
  }
  loadProfile() {
    this.myProfileService.getProfile().subscribe({
      next: (data) => {
        if (data) {
          this.profileName=`${data.firstName} ${data.lastName}`;
          this.myProfileForm.patchValue({
            ClientId: data.clientId,
            fullLegalName: `${data.firstName} ${data.lastName}`,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : '', // ✅ Extract YYYY-MM-DD
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
          });
        }
      },
      error: (error) => {
        console.error("Error fetching profile:", error);
      }
    });
  }
  

  /** ✅ Validate only the fields in the current step before proceeding */
  nextStep() {
    if (this.currentStep === 1) {
      // Validate Step 1 fields
      const step1Fields = ['fullLegalName', 'firstName', 'lastName',];
      const isStep1Valid = step1Fields.every(field => this. myProfileForm.get(field)?.valid);

      if (isStep1Valid) {
        this.currentStep++;
      } else {
        this. myProfileForm.markAllAsTouched(); // Show validation errors
      }
    } 
    else if (this.currentStep === 2) {
      // Validate Step 2 fields
      const step2Fields = ['email', 'phone', 'streetAddress', 'city', 'state', 'zipCode'];
      const isStep2Valid = step2Fields.every(field => this. myProfileForm.get(field)?.valid);

      if (isStep2Valid) {
        this.currentStep++;
      } else {
        this. myProfileForm.markAllAsTouched();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /** ✅ Update Profile Data */
  saveProfile() {
   
    const updatedProfile = {
      ClientId: this.myProfileForm.value.ClientId,
      FirstName: this.myProfileForm.value.firstName,
      LastName: this.myProfileForm.value.lastName,
      Gender: this.myProfileForm.value.gender,
      DateOfBirth: this.myProfileForm.value.dateOfBirth, // Ensure this is in 'YYYY-MM-DD' format
      Email: this.myProfileForm.value.email,
      PhoneNumber: this.myProfileForm.value.phoneNumber,
      Address: this.myProfileForm.value.address, // Match backend field
      City: this.myProfileForm.value.city,
      State: this.myProfileForm.value.state,
      ZipCode: this.myProfileForm.value.zipCode
    };
    
    this.myProfileService.updateProfile(updatedProfile).subscribe({
      next: (response) => {
        this.loadProfile();
        console.log("Profile updated successfully", response);
      },
      error: (error) => {
        console.error("Error updating profile:", error);
      }
    });
    

}
}

