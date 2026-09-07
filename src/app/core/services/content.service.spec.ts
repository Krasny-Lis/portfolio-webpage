import { signal } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';

import '@angular/compiler';
import { jest } from '@jest/globals';
import type { HttpClient } from '@angular/common/http';
import type { toObservable } from '@angular/core/rxjs-interop';

import { ContentService } from './content.service';
import { Project } from '../models/content.models';
import { TranslationService } from './translation.service';

describe('ContentService', () => {
  const projects: Project[] = [{ name: 'Test', description: 'Desc', tags: [] }];
  const versionedProjectsUrl = 'assets/content/en/projects.json?v=development';

  const createService = (httpGet: jest.Mock) => {
    const translations = {
      language: signal('en').asReadonly(),
    } as TranslationService;

    const language$ = new ReplaySubject<string>(1);
    language$.next('en');

    const toObservableStub: typeof toObservable = () => language$.asObservable();

    return {
      service: new ContentService(
        { get: httpGet } as unknown as HttpClient,
        translations,
        toObservableStub,
      ),
      language$,
    };
  };

  it('should cache requests based on the versioned url', () => {
    const getMock = jest.fn(() => of(projects));
    const { service } = createService(getMock);

    const first: Project[][] = [];
    service.getProjects().subscribe((value) => first.push(value));
    expect(first[0]).toEqual(projects);

    const second: Project[][] = [];
    service.getProjects().subscribe((value) => second.push(value));
    expect(second[0]).toEqual(projects);

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith(versionedProjectsUrl);
  });

  it('should clear cache when language changes', () => {
    const projectsEs: Project[] = [{ name: 'Test ES', description: 'Desc ES', tags: [] }];

    const getMock = jest.fn((url: string) =>
      url.includes('/es/') ? of(projectsEs) : of(projects),
    );

    const { service, language$ } = createService(getMock);

    const received: Project[][] = [];
    const subscription = service.getProjects().subscribe((value) => received.push(value));

    expect(received[0]).toEqual(projects);
    expect(getMock).toHaveBeenCalledWith(versionedProjectsUrl);

    const cache = (service as unknown as { cache: Map<string, unknown> }).cache;
    expect(cache.has(versionedProjectsUrl)).toBe(true);

    language$.next('es');

    const versionedSpanishUrl = 'assets/content/es/projects.json?v=development';
    expect(received[1]).toEqual(projectsEs);
    expect(getMock).toHaveBeenCalledWith(versionedSpanishUrl);
    expect(cache.has(versionedProjectsUrl)).toBe(false);
    expect(cache.has(versionedSpanishUrl)).toBe(true);

    subscription.unsubscribe();
  });
});
