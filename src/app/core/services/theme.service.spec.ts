import '@angular/compiler';
import 'zone.js';

import { jest } from '@jest/globals';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  afterAll(() => {
    TestBed.resetTestEnvironment();
  });

  function createDocumentStub(matchMediaResult?: boolean) {
    const body = document.createElement('body');

    const defaultView: Partial<Window> = {
      matchMedia:
        matchMediaResult === undefined
          ? undefined
          : (query: string) =>
              ({
                matches: matchMediaResult,
                media: query,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
                onchange: null,
                dispatchEvent: jest.fn(() => true),
              }) as unknown as MediaQueryList,
      setTimeout: (...args) => window.setTimeout(...args),
      clearTimeout: (id) => window.clearTimeout(id),
    };

    return {
      body,
      defaultView: defaultView as Window,
    } as unknown as Document;
  }

  afterEach(() => {
    localStorage.clear();
    jest.useRealTimers();
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  function createService(documentStub: Document) {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: documentStub }],
    });

    return TestBed.inject(ThemeService);
  }

  it('should initialize theme from stored preference', () => {
    localStorage.setItem('portfolio-theme', 'dark');
    const documentStub = createDocumentStub(false);

    const service = createService(documentStub);

    expect(service.theme()).toBe('dark');
    expect(documentStub.body.classList.contains('theme-dark')).toBe(true);
    expect(documentStub.body.classList.contains('theme-light')).toBe(false);
  });

  it('should detect preferred color scheme when no stored preference', () => {
    const documentStub = createDocumentStub(true);

    const service = createService(documentStub);

    expect(service.theme()).toBe('dark');
    expect(documentStub.body.classList.contains('theme-dark')).toBe(true);
  });

  it('should clean up transition flag after timeout', () => {
    jest.useFakeTimers();
    const documentStub = createDocumentStub(false);

    const service = createService(documentStub);

    expect(documentStub.body.classList.contains('theme-transition')).toBe(false);

    service.toggle();

    expect(documentStub.body.classList.contains('theme-transition')).toBe(true);
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');

    jest.advanceTimersByTime(600);

    expect(documentStub.body.classList.contains('theme-transition')).toBe(false);
  });
});
