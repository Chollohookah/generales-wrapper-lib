import { TestBed } from '@angular/core/testing';

import { HookaServiceService } from './hooka-service.service';

describe('HookaServiceService', () => {
  let service: HookaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HookaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
