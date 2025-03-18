import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalCareComponent } from './animal-care.component';

describe('AnimalCareComponent', () => {
  let component: AnimalCareComponent;
  let fixture: ComponentFixture<AnimalCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalCareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
