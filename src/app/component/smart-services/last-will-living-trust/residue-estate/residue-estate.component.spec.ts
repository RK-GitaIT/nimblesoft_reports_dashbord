import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueEstateComponent } from './residue-estate.component';

describe('ResidueEstateComponent', () => {
  let component: ResidueEstateComponent;
  let fixture: ComponentFixture<ResidueEstateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidueEstateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidueEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
