import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeSessionComponent } from './challenge-session.component';

describe('ChallengeSessionComponent', () => {
  let component: ChallengeSessionComponent;
  let fixture: ComponentFixture<ChallengeSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
