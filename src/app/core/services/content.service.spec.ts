mport { signal } from '@angular/core';
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

  it('should cache requests based on url', () => {
    const getMock = jest.fn(() => of(projects));
    const { service } = createService(getMock);

    const first: Project[][] = [];
    service.getProjects().subscribe((value) => first.push(value));
    expect(first[0]).toEqual(projects);

    const second: Project[][] = [];
    service.getProjects().subscribe((value) => second.push(value));
    expect(second[0]).toEqual(projects);

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('assets/content/en/projects.json');
  });

  it('should clear cache when language changes', () => {
    const projectsEs: Project[] = [{ name: 'Test ES', description: 'Desc ES', tags: [] }];
    let serviceRef!: ContentService;

    const getMock = jest.fn((url: string) => {
      if (url.includes('/es/')) {
        const cache = (serviceRef as unknown as { cache: Map<string, unknown> }).cache;
        expect(cache.has('assets/content/en/projects.json')).toBe(false);
        return of(projectsEs);
      }

      return of(projects);
    });

    const { service, language$ } = createService(getMock);
    serviceRef = service;

    const received: Project[][] = [];
    const subscription = service.getProjects().subscribe((value) => received.push(value));

    expect(received[0]).toEqual(projects);
    expect(getMock).toHaveBeenCalledWith('assets/content/en/projects.json');

    const cache = (service as unknown as { cache: Map<string, unknown> }).cache;
    expect(cache.has('assets/content/en/projects.json')).toBe(true);

    language$.next('es');

    expect(received[1]).toEqual(projectsEs);
    expect(getMock).toHaveBeenCalledWith('assets/content/es/projects.json');
    expect(cache.has('assets/content/en/projects.json')).toBe(false);
    expect(cache.has('assets/content/es/projects.json')).toBe(true);

    subscription.unsubscribe();
  });
});
