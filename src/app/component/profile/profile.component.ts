import { Component, OnInit } from '@angular/core';
import { ProfilesCrudService } from '../../services/json/profiles-crud.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profiles: any[] = [];
  profileForm: FormGroup;
  isEditing = false;
  currentProfileId: number | null = null;

  constructor(
    private profileCrud: ProfilesCrudService,
    private fb: FormBuilder
  ) {
    
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fileId: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
   
    this.profileCrud.getAll().subscribe(data => {
      this.profiles = data;
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      if (this.isEditing && this.currentProfileId !== null) {
        
        const updatedProfile = this.profileForm.value;
        this.profileCrud.update(this.currentProfileId, updatedProfile);
        this.isEditing = false;
        this.currentProfileId = null;
      } else {
        const newProfile = this.profileForm.value;
        this.profileCrud.add(newProfile);
      }
      this.profileForm.reset({ fileId: 1 });
      this.loadProfiles();
    }
  }

  editProfile(profile: any): void {
    this.isEditing = true;
    this.currentProfileId = profile.id;
    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
      fileId: profile.fileId || 1
    });
  }

  deleteProfile(id: number): void {
    this.profileCrud.delete(id);
    this.loadProfiles();
  }
}
