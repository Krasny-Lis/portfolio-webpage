import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContactFacade } from './contact.facade';

describe('ContactFacade', () => {
  let facade: ContactFacade;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    facade = TestBed.inject(ContactFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update status to success on send', () => {
    facade.send({ name: 'Test', email: 'test@example.com', message: 'hello world', consent: true });
    const request = httpMock.expectOne(/https:\/\/formspree\.io/);
    expect(facade.status()).toBe('pending');
    request.flush({ ok: true });
    expect(facade.status()).toBe('success');
  });

  it('should handle error state', () => {
    facade.send({ name: 'Test', email: 'test@example.com', message: 'hello world', consent: true });
    const request = httpMock.expectOne(/https:\/\/formspree\.io/);
    request.flush({ error: 'fail' }, { status: 500, statusText: 'Server Error' });
    expect(facade.status()).toBe('error');
    expect(facade.errorMessage()).toBeTruthy();
  });
});
