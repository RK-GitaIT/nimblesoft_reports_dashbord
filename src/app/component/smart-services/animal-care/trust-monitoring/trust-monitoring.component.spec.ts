import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustMonitoringComponent } from './trust-monitoring.component';

describe('TrustMonitoringComponent', () => {
  let component: TrustMonitoringComponent;
  let fixture: ComponentFixture<TrustMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
