import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { AppTranslations, Language, TRANSLATIONS } from './translation.data';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private document = inject(DOCUMENT);
  private storageKey = 'portfolio-language';
  private defaultLanguage: Language = 'en';
  private languageSignal = signal<Language>(this.resolveInitialLanguage());

  readonly language = this.languageSignal.asReadonly();
  readonly translations = computed<AppTranslations>(() => {
    const lang = this.languageSignal();
    return TRANSLATIONS[lang] ?? TRANSLATIONS[this.defaultLanguage];
  });

  constructor() {
    effect(() => {
      const lang = this.languageSignal();
      this.updateDocumentLang(lang);
      this.persistLanguage(lang);
    });
  }

  setLanguage(lang: Language): void {
    if (!TRANSLATIONS[lang] || lang === this.languageSignal()) {
      return;
    }
    this.languageSignal.set(lang);
  }

  toggleLanguage(): void {
    this.setLanguage(this.languageSignal() === 'en' ? 'pl' : 'en');
  }

  private resolveInitialLanguage(): Language {
    const stored = this.readStoredLanguage();
    if (stored) {
      return stored;
    }

    const navigatorLang = this.document?.defaultView?.navigator;
    const candidates: string[] = [];
    if (navigatorLang?.languages?.length) {
      candidates.push(...navigatorLang.languages);
    }
    if (navigatorLang?.language) {
      candidates.push(navigatorLang.language);
    }

    const found = candidates.map((value) => value?.toLowerCase()).find((value) => value?.startsWith('pl'));
    if (found) {
      return 'pl';
    }

    return this.defaultLanguage;
  }

  private readStoredLanguage(): Language | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey) as Language | null;
        if (stored && TRANSLATIONS[stored]) {
          return stored;
        }
      }
    } catch {
      // ignore persistence errors
    }
    return null;
  }

  private persistLanguage(lang: Language): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, lang);
      }
    } catch {
      // ignore persistence errors
    }
  }

  private updateDocumentLang(lang: Language): void {
    if (this.document?.documentElement) {
      this.document.documentElement.lang = lang;
    }
  }
}
