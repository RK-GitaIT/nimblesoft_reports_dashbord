import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessorExecutorsComponent } from './successor-executors.component';

describe('SuccessorExecutorsComponent', () => {
  let component: SuccessorExecutorsComponent;
  let fixture: ComponentFixture<SuccessorExecutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessorExecutorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessorExecutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
