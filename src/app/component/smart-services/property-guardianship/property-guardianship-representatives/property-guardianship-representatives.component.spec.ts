import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuardianshipRepresentativesComponent } from './property-guardianship-representatives.component';

describe('PropertyGuardianshipRepresentativesComponent', () => {
  let component: PropertyGuardianshipRepresentativesComponent;
  let fixture: ComponentFixture<PropertyGuardianshipRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyGuardianshipRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyGuardianshipRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
