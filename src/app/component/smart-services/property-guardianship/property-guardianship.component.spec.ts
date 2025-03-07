import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuardianshipComponent } from './property-guardianship.component';

describe('PropertyGuardianshipComponent', () => {
  let component: PropertyGuardianshipComponent;
  let fixture: ComponentFixture<PropertyGuardianshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyGuardianshipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyGuardianshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
