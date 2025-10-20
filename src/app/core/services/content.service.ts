import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, shareReplay, switchMap } from 'rxjs';

import { Project, SkillGroup, SocialLink } from '../models/content.models';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private translations = inject(TranslationService);
  private cache = new Map<string, Observable<unknown>>();
  private language$ = toObservable(this.translations.language);

  getProjects(): Observable<Project[]> {
    return this.language$.pipe(switchMap((lang) => this.get<Project[]>(`assets/content/${lang}/projects.json`)));
  }

  getSkills(): Observable<SkillGroup[]> {
    return this.language$.pipe(switchMap((lang) => this.get<SkillGroup[]>(`assets/content/${lang}/skills.json`)));
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
