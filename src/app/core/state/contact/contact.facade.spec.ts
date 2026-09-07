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
  };

  it('should open the mail client when available', () => {
    const openSpy = jest.fn(() => ({}) as WindowProxy);
    const facade = new ContactFacade(
      {
        defaultView: { open: openSpy },
      } as unknown as Document,
      translationsStub,
    );

    facade.send(basePayload);

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = openSpy.mock.calls[0][0] as string;
    expect(openSpy.mock.calls[0][1]).toBe('_self');
    expect(url.startsWith('mailto:sliwa.lis.krzysztof@gmail.com')).toBe(true);

    const [, query] = url.split('?');
    const params = new URLSearchParams(query);
    expect(params.get('subject')).toBe(basePayload.subject.trim());
    expect(params.get('body')).toBe(
      `From: ${basePayload.name} <${basePayload.email}>\n\n${basePayload.message}`,
    );
    expect(facade.status()).toBe('success');
  });

  it('should expose an error when mail client is unavailable', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const openSpy = jest.fn(() => null);

    const facade = new ContactFacade(
      {
        defaultView: { open: openSpy },
      } as unknown as Document,
      translationsStub,
    );

    facade.send(basePayload);

    expect(facade.status()).toBe('error');
    expect(facade.errorMessage()).toBe('Something went wrong');
    expect(openSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('should fallback to global window when document defaultView is unavailable', () => {
    const openSpy = jest.fn(() => ({}) as WindowProxy);
    const globalWithWindow = globalThis as typeof globalThis & { window?: Window };
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const originalWindow = globalWithWindow.window;
    const stubWindow = { open: openSpy } as unknown as Window;

    const restoreWindow = () => {
      if (originalDescriptor) {
        Object.defineProperty(globalThis, 'window', originalDescriptor);
      } else if (typeof originalWindow === 'undefined') {
        delete globalWithWindow.window;
      } else {
        globalWithWindow.window = originalWindow;
      }
    };

    try {
      if (!originalDescriptor || originalDescriptor.configurable) {
        Object.defineProperty(globalThis, 'window', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: stubWindow,
        });
      } else {
        globalWithWindow.window = stubWindow;
      }
    } catch {
      globalWithWindow.window = stubWindow;
    }

    try {
      const facade = new ContactFacade(
        {
          defaultView: null,
        } as unknown as Document,
        translationsStub,
      );

      facade.send(basePayload);

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(facade.status()).toBe('success');
    } finally {
      restoreWindow();
    }
  });
});
