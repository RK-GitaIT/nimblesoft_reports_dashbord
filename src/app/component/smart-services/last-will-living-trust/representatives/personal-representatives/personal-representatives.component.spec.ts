import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRepresentativesComponent } from './personal-representatives.component';

describe('PersonalRepresentativesComponent', () => {
  let component: PersonalRepresentativesComponent;
  let fixture: ComponentFixture<PersonalRepresentativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalRepresentativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalRepresentativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
