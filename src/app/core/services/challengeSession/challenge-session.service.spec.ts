import { TestBed } from '@angular/core/testing';

import { ChallengeSessionService } from './challenge-session.service';

describe('ChallengeSessionService', () => {
  let service: ChallengeSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengeSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
