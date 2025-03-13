import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduaryEstateComponent } from './residuary-estate.component';

describe('ResiduaryEstateComponent', () => {
  let component: ResiduaryEstateComponent;
  let fixture: ComponentFixture<ResiduaryEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResiduaryEstateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResiduaryEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
