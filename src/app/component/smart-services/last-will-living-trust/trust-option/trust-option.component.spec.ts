import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustOptionComponent } from './trust-option.component';

describe('TrustOptionComponent', () => {
  let component: TrustOptionComponent;
  let fixture: ComponentFixture<TrustOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
