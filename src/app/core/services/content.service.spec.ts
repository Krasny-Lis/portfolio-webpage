import { of } from 'rxjs';

import '@angular/compiler';
import { jest } from '@jest/globals';
import type { HttpClient } from '@angular/common/http';

import { ContentService } from './content.service';
import { Project } from '../models/content.models';
import { TranslationService } from './translation.service';

describe('ContentService', () => {
  const projects: Project[] = [
    { id: '1', name: 'Test', description: 'Desc', tags: [] },
  ];

  const createService = (httpGet: jest.Mock) => {
    const translations = {
      language: (() => 'en') as unknown as TranslationService['language'],
    } as TranslationService;

    return new ContentService({ get: httpGet } as unknown as HttpClient, translations, () => of('en'));
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
