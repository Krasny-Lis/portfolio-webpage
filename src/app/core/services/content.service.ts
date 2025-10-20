import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Project, SkillGroup, SocialLink } from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<unknown>>();

  getProjects(): Observable<Project[]> {
    return this.get<Project[]>('assets/content/projects.json');
  }

  getSkills(): Observable<SkillGroup[]> {
    return this.get<SkillGroup[]>('assets/content/skills.json');
  }

  getSocialLinks(): Observable<SocialLink[]> {
    return this.get<SocialLink[]>('assets/content/social.json');
  }

  private get<T>(url: string): Observable<T> {
    if (!this.cache.has(url)) {
      const request$ = this.http.get<T>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)! as Observable<T>;
  }
}
