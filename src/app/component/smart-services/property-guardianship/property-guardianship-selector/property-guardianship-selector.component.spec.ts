import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuardianshipSelectorComponent } from './property-guardianship-selector.component';

describe('PropertyGuardianshipSelectorComponent', () => {
  let component: PropertyGuardianshipSelectorComponent;
  let fixture: ComponentFixture<PropertyGuardianshipSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyGuardianshipSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyGuardianshipSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
