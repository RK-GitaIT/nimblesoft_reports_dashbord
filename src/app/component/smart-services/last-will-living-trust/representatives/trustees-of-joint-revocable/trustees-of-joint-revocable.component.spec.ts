import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrusteesOfJointRevocableComponent } from './trustees-of-joint-revocable.component';

describe('TrusteesOfJointRevocableComponent', () => {
  let component: TrusteesOfJointRevocableComponent;
  let fixture: ComponentFixture<TrusteesOfJointRevocableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrusteesOfJointRevocableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrusteesOfJointRevocableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
