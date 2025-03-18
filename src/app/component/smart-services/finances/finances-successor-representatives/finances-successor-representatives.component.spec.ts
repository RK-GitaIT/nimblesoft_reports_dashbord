import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancesSuccessorRepresentativesComponent } from './finances-successor-representatives.component';

describe('FinancesSuccessorRepresentativesComponent', () => {
  let component: FinancesSuccessorRepresentativesComponent;
  let fixture: ComponentFixture<FinancesSuccessorRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesSuccessorRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancesSuccessorRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
