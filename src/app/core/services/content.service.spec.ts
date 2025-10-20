import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentService } from './content.service';
import { Project } from '../models/content.models';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache requests', () => {
    const mockProjects: Project[] = [
      { id: '1', name: 'Test', description: 'Desc', tags: [] }
    ];

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
    });

    const request = httpMock.expectOne('assets/content/projects.json');
    request.flush(mockProjects);

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
    });

    httpMock.expectNone('assets/content/projects.json');
  });
});
