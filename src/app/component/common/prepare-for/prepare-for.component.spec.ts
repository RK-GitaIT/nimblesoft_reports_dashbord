import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareForComponent } from './prepare-for.component';

describe('PrepareForComponent', () => {
  let component: PrepareForComponent;
  let fixture: ComponentFixture<PrepareForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepareForComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
