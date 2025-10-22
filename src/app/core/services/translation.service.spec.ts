import '@angular/compiler';
import { DOCUMENT } from '@angular/common';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { jest } from '@jest/globals';

import { TranslationService } from './translation.service';
import type { Language } from './translation.data';

type NavigatorStub = Pick<Navigator, 'languages' | 'language'>;

const STORAGE_KEY = 'portfolio-language';

describe('TranslationService', () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  function createStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial));

    const storage: Storage = {
      get length() {
        return data.size;
      },
      clear: jest.fn(() => data.clear()),
      getItem: jest.fn((key: string) => (data.has(key) ? data.get(key)! : null)),
      key: jest.fn((index: number) => Array.from(data.keys())[index] ?? null),
      removeItem: jest.fn((key: string) => {
        data.delete(key);
      }),
      setItem: jest.fn((key: string, value: string) => {
        data.set(key, value);
      }),
    };

    return storage;
  }

  function createService(options: { navigator?: Partial<NavigatorStub>; storage?: Storage } = {}) {
    const navigatorStub: NavigatorStub = {
      languages: ['en'],
      language: 'en',
      ...options.navigator,
    };

    const defaultView = {
      navigator: navigatorStub,
    } as unknown as Window & typeof globalThis;

    const documentElement = { lang: 'en' } as HTMLElement;
    const documentStub = {
      defaultView,
      documentElement,
    } as unknown as Document;

    const storage = options.storage ?? createStorage();

    TestBed.overrideProvider(DOCUMENT, { useValue: documentStub });
    const service = TestBed.runInInjectionContext(() => new TranslationService(documentStub, storage));

    return { service, documentElement, storage };
  }

  it('initializes from a stored language and updates the document lang attribute', () => {
    const storage = createStorage({ [STORAGE_KEY]: 'pl' });

    const { service, documentElement } = createService({ storage });

    expect(service.language()).toBe('pl');
    expect(documentElement.lang).toBe('pl');
  });

  it('persists toggled language changes', () => {
    const storage = createStorage();
    const { service, documentElement } = createService({ storage });

    expect(service.language()).toBe('en');
    expect(documentElement.lang).toBe('en');
    const initialCalls = (storage.setItem as jest.Mock).mock.calls;
    expect(initialCalls).not.toHaveLength(0);
    expect(initialCalls[initialCalls.length - 1]).toEqual([STORAGE_KEY, 'en']);

    service.toggleLanguage();

    expect(service.language()).toBe('pl');
    expect(documentElement.lang).toBe('pl');
    const afterFirstToggle = (storage.setItem as jest.Mock).mock.calls;
    expect(afterFirstToggle[afterFirstToggle.length - 1]).toEqual([STORAGE_KEY, 'pl']);

    service.toggleLanguage();

    expect(service.language()).toBe('en');
    expect(documentElement.lang).toBe('en');
    const afterSecondToggle = (storage.setItem as jest.Mock).mock.calls;
    expect(afterSecondToggle[afterSecondToggle.length - 1]).toEqual([STORAGE_KEY, 'en']);
  });

  it('detects the preferred language from navigator settings when storage is empty', () => {
    const { service, documentElement } = createService({
      navigator: {
        languages: ['de-DE', 'pl-PL'],
        language: 'de-DE',
      },
    });

    expect(service.language()).toBe('pl');
    expect(documentElement.lang).toBe('pl');
  });

  it('ignores unsupported language codes', () => {
    const { service } = createService();

    service.setLanguage('es' as unknown as Language);

    expect(service.language()).toBe('en');
  });
});
