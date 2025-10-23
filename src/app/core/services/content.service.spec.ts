import { signal } from '@angular/core';
import { of } from 'rxjs';

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

    const toObservableStub: typeof toObservable = () => of('en');

    return new ContentService(
      { get: httpGet } as unknown as HttpClient,
      translations,
      toObservableStub,
    );
  };

  it('should cache requests based on url', () => {
    const getMock = jest.fn(() => of(projects));
    const service = createService(getMock);

    const first: Project[][] = [];
    service.getProjects().subscribe((value) => first.push(value));
    expect(first[0]).toEqual(projects);

    const second: Project[][] = [];
    service.getProjects().subscribe((value) => second.push(value));
    expect(second[0]).toEqual(projects);

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('assets/content/en/projects.json');
  });
});
