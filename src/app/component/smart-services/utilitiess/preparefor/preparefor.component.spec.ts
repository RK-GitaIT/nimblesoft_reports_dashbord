import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareforComponent } from './preparefor.component';

describe('PrepareforComponent', () => {
  let component: PrepareforComponent;
  let fixture: ComponentFixture<PrepareforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepareforComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
