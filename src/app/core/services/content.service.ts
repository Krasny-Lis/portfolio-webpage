import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { Project, SkillGroup, SocialLink } from '../models/content.models';
import { TranslationService } from './translation.service';

const CONTENT_VERSION =
  typeof BUILD_VERSION === 'undefined' ? 'development' : BUILD_VERSION;

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
  private currentLanguage?: string;

  constructor(
    http?: HttpClient,
    translations?: TranslationService,
    @Optional() @Inject(LANGUAGE_TO_OBSERVABLE) languageToObservable?: typeof toObservable,
  ) {
    this.http = http ?? inject(HttpClient);
    this.translations = translations ?? inject(TranslationService);
    this.language$ = (languageToObservable ?? toObservable)(this.translations.language).pipe(
      tap((language) => {
        if (this.currentLanguage && this.currentLanguage !== language) {
          this.cache.clear();
        }
        this.currentLanguage = language;
      }),
    );
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
    const versionedUrl = this.withContentVersion(url);

    if (!this.cache.has(versionedUrl)) {
      const request$ = this.http
        .get<T>(versionedUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
      this.cache.set(versionedUrl, request$);
    }

    return this.cache.get(versionedUrl)! as Observable<T>;
  }

  private withContentVersion(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(CONTENT_VERSION)}`;
  }
}
