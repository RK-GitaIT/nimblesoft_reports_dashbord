import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessorComponent } from './successor.component';

describe('SuccessorComponent', () => {
  let component: SuccessorComponent;
  let fixture: ComponentFixture<SuccessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
