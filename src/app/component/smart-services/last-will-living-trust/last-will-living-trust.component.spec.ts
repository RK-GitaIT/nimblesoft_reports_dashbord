import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastWillLivingTrustComponent } from './last-will-living-trust.component';

describe('LastWillLivingTrustComponent', () => {
  let component: LastWillLivingTrustComponent;
  let fixture: ComponentFixture<LastWillLivingTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastWillLivingTrustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastWillLivingTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
