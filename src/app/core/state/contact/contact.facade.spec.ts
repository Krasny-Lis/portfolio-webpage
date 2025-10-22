import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ContactFacade, ContactFormPayload } from './contact.facade';

describe('ContactFacade', () => {
  const basePayload: ContactFormPayload = {
    name: 'Test User',
    email: 'user@example.com',
    subject: 'Hello world',
    message: 'Line 1\nLine 2',
  };

  describe('when mail client is available', () => {
    let facade: ContactFacade;
    let assignSpy: jest.Mock;

    beforeEach(() => {
      assignSpy = jest.fn();
      const mockDocument = {
        defaultView: {
          location: { assign: assignSpy },
          navigator: { languages: ['en'], language: 'en' },
        },
        documentElement: { lang: 'en' },
      } as unknown as Document;

      TestBed.configureTestingModule({
        providers: [ContactFacade, { provide: DOCUMENT, useValue: mockDocument }],
      });

      facade = TestBed.inject(ContactFacade);
    });

    it('should open the default mail client with encoded subject and body', () => {
      facade.send(basePayload);

      expect(assignSpy).toHaveBeenCalledTimes(1);
      const url: string = assignSpy.mock.calls[0][0];
      expect(url).toContain('mailto:sliwa.lis.krzysztof@gmail.com');
      expect(url).toContain(`subject=${encodeURIComponent(basePayload.subject)}`);
      const expectedBody = encodeURIComponent(
        `From: ${basePayload.name} <${basePayload.email}>\nConsent granted: yes\n\n${basePayload.message}`,
      );
      expect(url).toContain(`body=${expectedBody}`);
      expect(facade.status()).toBe('success');
    });
  });

  describe('when mail client is unavailable', () => {
    let facade: ContactFacade;
    beforeEach(() => {
      const mockDocument = {
        defaultView: null,
        documentElement: { lang: 'en' },
      } as unknown as Document;

      TestBed.configureTestingModule({
        providers: [ContactFacade, { provide: DOCUMENT, useValue: mockDocument }],
      });

      facade = TestBed.inject(ContactFacade);
    });

    it('should expose an error state', () => {
      facade.send(basePayload);

      expect(facade.status()).toBe('error');
      expect(facade.errorMessage()).toBeTruthy();
    });
  });
});
