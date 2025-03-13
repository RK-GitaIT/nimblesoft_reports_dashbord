import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessorsComponent } from './successors.component';

describe('SuccessorsComponent', () => {
  let component: SuccessorsComponent;
  let fixture: ComponentFixture<SuccessorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
