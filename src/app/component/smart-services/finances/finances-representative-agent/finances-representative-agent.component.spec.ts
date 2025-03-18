import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancesRepresentativeAgentComponent } from './finances-representative-agent.component';

describe('FinancesRepresentativeAgentComponent', () => {
  let component: FinancesRepresentativeAgentComponent;
  let fixture: ComponentFixture<FinancesRepresentativeAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesRepresentativeAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancesRepresentativeAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
