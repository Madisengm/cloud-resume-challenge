import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCounter } from './visitor-counter';

describe('VisitorCounter', () => {
  let component: VisitorCounter;
  let fixture: ComponentFixture<VisitorCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
