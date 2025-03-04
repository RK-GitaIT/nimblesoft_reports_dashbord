import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HipaaFormComponent } from './hippa-form.component';

describe('HippaFormComponent', () => {
  let component: HipaaFormComponent;
  let fixture: ComponentFixture<HipaaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HipaaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HipaaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
