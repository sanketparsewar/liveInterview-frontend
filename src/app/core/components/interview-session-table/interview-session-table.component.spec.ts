import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSessionTableComponent } from './interview-session-table.component';

describe('InterviewSessionTableComponent', () => {
  let component: InterviewSessionTableComponent;
  let fixture: ComponentFixture<InterviewSessionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewSessionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewSessionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
