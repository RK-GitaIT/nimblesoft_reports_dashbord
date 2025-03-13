import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeneficieryComponent } from './add-beneficiery.component';

describe('AddBeneficieryComponent', () => {
  let component: AddBeneficieryComponent;
  let fixture: ComponentFixture<AddBeneficieryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBeneficieryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBeneficieryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
