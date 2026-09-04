import '@angular/compiler';
import {
  BrowserPlatformLocation,
  HashLocationStrategy,
  Location,
  LocationStrategy,
  PlatformLocation,
} from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { appConfig } from './app.config.pages';

describe('GitHub Pages configuration', () => {
  let previousUrl: string;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    previousUrl = window.location.href;
    window.history.replaceState(null, '', '/portfolio-webpage/#/projects');
    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        {
          provide: PlatformLocation,
          useClass: BrowserPlatformLocation,
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    window.history.replaceState(null, '', previousUrl);
  });

  it('uses hash routing without asking Pages for route-specific files', () => {
    const strategy = TestBed.inject(LocationStrategy);

    expect(strategy).toBeInstanceOf(HashLocationStrategy);
    expect(strategy.prepareExternalUrl('/contact')).toBe('#/contact');
  });

  it('reads a directly opened route from the hash', () => {
    expect(TestBed.inject(Location).path()).toBe('/projects');
  });

  it('keeps the repository path when navigating between routes', () => {
    const location = TestBed.inject(Location);
    const platform = TestBed.inject(PlatformLocation);

    location.go('/contact');

    expect(platform.pathname).toBe('/portfolio-webpage/');
    expect(platform.hash).toBe('#/contact');
    expect(location.path()).toBe('/contact');
  });
});
