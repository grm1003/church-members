import { TestBed } from '@angular/core/testing';

import { GetMembers } from './get-members';

describe('GetMembers', () => {
  let service: GetMembers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMembers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
