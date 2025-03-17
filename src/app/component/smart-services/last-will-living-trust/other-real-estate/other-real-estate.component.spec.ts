import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRealEstateComponent } from './other-real-estate.component';

describe('OtherRealEstateComponent', () => {
  let component: OtherRealEstateComponent;
  let fixture: ComponentFixture<OtherRealEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherRealEstateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
