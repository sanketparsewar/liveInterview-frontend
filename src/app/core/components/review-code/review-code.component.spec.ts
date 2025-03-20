import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCodeComponent } from './review-code.component';

describe('ReviewCodeComponent', () => {
  let component: ReviewCodeComponent;
  let fixture: ComponentFixture<ReviewCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
