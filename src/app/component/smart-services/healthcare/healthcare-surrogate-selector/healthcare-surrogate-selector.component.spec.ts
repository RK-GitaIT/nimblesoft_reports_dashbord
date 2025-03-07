import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareSurrogateSelectorComponent } from './healthcare-surrogate-selector.component';

describe('HealthcareSurrogateSelectorComponent', () => {
  let component: HealthcareSurrogateSelectorComponent;
  let fixture: ComponentFixture<HealthcareSurrogateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareSurrogateSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareSurrogateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
