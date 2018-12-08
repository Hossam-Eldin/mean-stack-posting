import { TestBed } from '@angular/core/testing';

import { AuthSerService } from './auth-ser.service';

describe('AuthSerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthSerService = TestBed.get(AuthSerService);
    expect(service).toBeTruthy();
  });
});
