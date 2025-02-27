import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpoaFormComponent } from './dpoa-form.component';

describe('DpoaFormComponent', () => {
  let component: DpoaFormComponent;
  let fixture: ComponentFixture<DpoaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpoaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpoaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
