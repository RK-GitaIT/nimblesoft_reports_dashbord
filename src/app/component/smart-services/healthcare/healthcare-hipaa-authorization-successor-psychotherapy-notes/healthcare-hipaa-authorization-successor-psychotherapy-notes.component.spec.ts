import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent } from './healthcare-hipaa-authorization-successor-psychotherapy-notes.component';

describe('HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent', () => {
  let component: HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent;
  let fixture: ComponentFixture<HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareHipaaAuthorizationSuccessorPsychotherapyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
