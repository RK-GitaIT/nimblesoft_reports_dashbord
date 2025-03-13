import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessorRepresentativesComponent } from './successor-representatives.component';

describe('SuccessorRepresentativesComponent', () => {
  let component: SuccessorRepresentativesComponent;
  let fixture: ComponentFixture<SuccessorRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessorRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessorRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
