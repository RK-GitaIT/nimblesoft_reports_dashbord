import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimateDispositionComponent } from './ultimate-disposition.component';

describe('UltimateDispositionComponent', () => {
  let component: UltimateDispositionComponent;
  let fixture: ComponentFixture<UltimateDispositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimateDispositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimateDispositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
