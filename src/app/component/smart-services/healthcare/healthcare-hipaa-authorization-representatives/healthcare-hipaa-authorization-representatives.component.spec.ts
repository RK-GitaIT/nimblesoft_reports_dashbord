import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareHipaaAuthorizationRepresentativesComponent } from './healthcare-hipaa-authorization-representatives.component';

describe('HealthcareHipaaAuthorizationRepresentativesComponent', () => {
  let component: HealthcareHipaaAuthorizationRepresentativesComponent;
  let fixture: ComponentFixture<HealthcareHipaaAuthorizationRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareHipaaAuthorizationRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareHipaaAuthorizationRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
