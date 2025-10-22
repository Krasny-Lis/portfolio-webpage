import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

import { Project, SkillGroup, SocialLink } from '../models/content.models';
import { TranslationService } from './translation.service';

export const LANGUAGE_TO_OBSERVABLE = new InjectionToken<typeof toObservable>(
  'LANGUAGE_TO_OBSERVABLE',
  {
    providedIn: 'root',
    factory: () => toObservable,
  },
);

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http: HttpClient;
  private translations: TranslationService;
  private cache = new Map<string, Observable<unknown>>();
  private language$: Observable<string>;

  constructor(
    http?: HttpClient,
    translations?: TranslationService,
    @Optional() @Inject(LANGUAGE_TO_OBSERVABLE) languageToObservable?: typeof toObservable,
  ) {
    this.http = http ?? inject(HttpClient);
    this.translations = translations ?? inject(TranslationService);
    this.language$ = (languageToObservable ?? toObservable)(this.translations.language);
  }

  getProjects(): Observable<Project[]> {
    return this.language$.pipe(
      switchMap((lang) => this.get<Project[]>(`assets/content/${lang}/projects.json`)),
    );
  }

  getSkills(): Observable<SkillGroup[]> {
    return this.language$.pipe(
      switchMap((lang) => this.get<SkillGroup[]>(`assets/content/${lang}/skills.json`)),
      map((groups) =>
        groups.map((group) => ({
          ...group,
          items: group.items.map((item) => ({
            ...item,
            note: item.note?.replace(/\\n/g, '\n'),
          })),
        })),
      ),
    );
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
