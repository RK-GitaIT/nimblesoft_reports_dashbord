import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareSuccessorHealthcareAgentComponent } from './healthcare-successor-healthcare-agent.component';

describe('HealthcareSuccessorHealthcareAgentComponent', () => {
  let component: HealthcareSuccessorHealthcareAgentComponent;
  let fixture: ComponentFixture<HealthcareSuccessorHealthcareAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareSuccessorHealthcareAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareSuccessorHealthcareAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
