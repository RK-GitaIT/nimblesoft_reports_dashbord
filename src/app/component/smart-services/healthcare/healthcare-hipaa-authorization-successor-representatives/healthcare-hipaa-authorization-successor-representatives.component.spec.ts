import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareHipaaAuthorizationSuccessorRepresentativesComponent } from './healthcare-hipaa-authorization-successor-representatives.component';

describe('HealthcareHipaaAuthorizationSuccessorRepresentativesComponent', () => {
  let component: HealthcareHipaaAuthorizationSuccessorRepresentativesComponent;
  let fixture: ComponentFixture<HealthcareHipaaAuthorizationSuccessorRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareHipaaAuthorizationSuccessorRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareHipaaAuthorizationSuccessorRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
