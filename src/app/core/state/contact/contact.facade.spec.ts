import '@angular/compiler';
import { jest } from '@jest/globals';

import { ContactFacade, ContactFormPayload } from './contact.facade';
import type { TranslationService } from '../../services/translation.service';

describe('ContactFacade', () => {
  const translationsStub = {
    translations: () => ({
      contact: { error: 'Something went wrong' },
    }),
  } as unknown as TranslationService;

  const basePayload: ContactFormPayload = {
    name: 'Test User',
    email: 'user@example.com',
    subject: 'Hello world',
    message: 'Line 1\nLine 2',
    consent: true,
  };

  it('should open the mail client when available', () => {
    const assignSpy = jest.fn();
    const facade = new ContactFacade(
      {
        defaultView: {
          location: { assign: assignSpy },
          navigator: { languages: ['en'], language: 'en' },
        },
        documentElement: { lang: 'en' },
      } as unknown as Document,
      translationsStub,
    );

    facade.send(basePayload);

    expect(assignSpy).toHaveBeenCalledTimes(1);
    const url = assignSpy.mock.calls[0][0] as string;
    expect(url).toContain('mailto:sliwa.lis.krzysztof@gmail.com');
    expect(url).toContain(`subject=${encodeURIComponent(basePayload.subject)}`);
    expect(url).toContain(encodeURIComponent('Consent granted: yes'));
    expect(facade.status()).toBe('success');
  });

  it('should expose an error when mail client is unavailable', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const facade = new ContactFacade(
      {
        defaultView: null,
        documentElement: { lang: 'en' },
      } as unknown as Document,
      translationsStub,
    );

    facade.send(basePayload);

    expect(facade.status()).toBe('error');
    expect(facade.errorMessage()).toBe('Something went wrong');
    consoleSpy.mockRestore();
  });
});
