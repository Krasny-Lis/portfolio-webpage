import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, Inject, Optional, signal } from '@angular/core';

import { AppTranslations, Language, TRANSLATIONS } from './translation.data';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private document: Document | null;
  private storage: Storage | null;
  private storageKey = 'portfolio-language';
  private defaultLanguage: Language = 'en';
  private languageSignal = signal<Language>(this.defaultLanguage);

  readonly language = this.languageSignal.asReadonly();
  readonly translations = computed<AppTranslations>(() => {
    const lang = this.languageSignal();
    return TRANSLATIONS[lang] ?? TRANSLATIONS[this.defaultLanguage];
  });

  constructor(
    @Optional() @Inject(DOCUMENT) document?: Document | null,
    @Optional() storage?: Storage | null,
  ) {
    this.document = document ?? this.tryInjectDocument();
    this.storage = storage ?? this.resolveStorage();
    const initialLanguage = this.resolveInitialLanguage();
    this.languageSignal.set(initialLanguage);
    this.updateDocumentLang(initialLanguage);
    this.persistLanguage(initialLanguage);

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
    this.updateDocumentLang(lang);
    this.persistLanguage(lang);
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
    const storage = this.storage;
    if (!storage) {
      return null;
    }

    try {
      const stored = storage.getItem(this.storageKey) as Language | null;
      if (stored && TRANSLATIONS[stored]) {
        return stored;
      }
    } catch {
      // ignore persistence errors
    }
    return null;
  }

  private persistLanguage(lang: Language): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    try {
      storage.setItem(this.storageKey, lang);
    } catch {
      // ignore persistence errors
    }
  }

  private updateDocumentLang(lang: Language): void {
    if (this.document?.documentElement) {
      this.document.documentElement.lang = lang;
    }
  }

  private tryInjectDocument(): Document | null {
    try {
      return inject(DOCUMENT);
    } catch {
      return null;
    }
  }

  private resolveStorage(): Storage | null {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage;
      }
    } catch {
      // ignore storage resolution errors
    }
    return null;
  }
}
