import '@angular/compiler';
import 'zone.js';

import { DestroyRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { jest } from '@jest/globals';

import { BackToTopComponent } from './back-to-top.component';
import { TranslationService } from '../../services/translation.service';
import { TRANSLATIONS } from '../../services/translation.data';

describe('BackToTopComponent', () => {
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame | undefined;
  let originalCancelAnimationFrame: typeof window.cancelAnimationFrame | undefined;
  let scrollYDescriptor: PropertyDescriptor | undefined;
  let rafCallbacks: FrameRequestCallback[];
  let destroyRef: MockDestroyRef;

  class MockDestroyRef extends DestroyRef {
    private readonly callbacks = new Set<() => void>();

    override onDestroy(callback: () => void): () => void {
      this.callbacks.add(callback);
      return () => this.callbacks.delete(callback);
    }

    destroy(): void {
      for (const callback of this.callbacks) {
        callback();
      }
      this.callbacks.clear();
    }
  }

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  afterAll(() => {
    TestBed.resetTestEnvironment();
  });

  beforeEach(() => {
    rafCallbacks = [];

    originalRequestAnimationFrame = window.requestAnimationFrame;
    originalCancelAnimationFrame = window.cancelAnimationFrame;

    window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    window.cancelAnimationFrame = jest.fn();

    scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: 0,
    });

    destroyRef = new MockDestroyRef();

    TestBed.configureTestingModule({
      providers: [
        { provide: DestroyRef, useValue: destroyRef },
        {
          provide: TranslationService,
          useValue: {
            translations: signal(TRANSLATIONS.en),
          } satisfies Pick<TranslationService, 'translations'>,
        },
      ],
    });
  });

  afterEach(() => {
    if (originalRequestAnimationFrame) {
      window.requestAnimationFrame = originalRequestAnimationFrame;
    } else {
      delete (window as Partial<Window>).requestAnimationFrame;
    }

    if (originalCancelAnimationFrame) {
      window.cancelAnimationFrame = originalCancelAnimationFrame;
    } else {
      delete (window as Partial<Window>).cancelAnimationFrame;
    }

    if (scrollYDescriptor) {
      Object.defineProperty(window, 'scrollY', scrollYDescriptor);
    } else {
      delete (window as Partial<Window>).scrollY;
    }

    destroyRef.destroy();
    TestBed.resetTestingModule();
  });

  const flushNextFrame = () => {
    const callback = rafCallbacks.shift();
    if (!callback) {
      throw new Error('No frame scheduled');
    }
    callback(performance.now());
  };

  it('throttles visibility updates while applying the latest scroll position when scrolling stops', () => {
    const component = TestBed.runInInjectionContext(() => new BackToTopComponent());

    expect(component.visible()).toBe(false);

    (window as typeof window & { scrollY: number }).scrollY = 450;
    window.dispatchEvent(new Event('scroll'));
    (window as typeof window & { scrollY: number }).scrollY = 460;
    window.dispatchEvent(new Event('scroll'));

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(component.visible()).toBe(false);

    flushNextFrame();
    expect(component.visible()).toBe(true);

    (window as typeof window & { scrollY: number }).scrollY = 100;
    window.dispatchEvent(new Event('scroll'));

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);

    flushNextFrame();
    expect(component.visible()).toBe(false);
  });
});
