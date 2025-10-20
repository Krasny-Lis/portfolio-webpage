import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'portfolio-theme';
  private document = inject(DOCUMENT);
  private themeSignal = signal<ThemeName>(this.readInitial());

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
    this.themeSignal.subscribe((value) => this.applyTheme(value));
  }

  toggle(): void {
    this.setTheme(this.themeSignal() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: ThemeName): void {
    this.themeSignal.set(theme);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, theme);
      }
    } catch (err) {
      console.warn('Unable to persist theme', err);
    }
  }

  private applyTheme(theme: ThemeName): void {
    const body = this.document.body;
    body.classList.toggle('theme-dark', theme === 'dark');
    body.classList.toggle('theme-light', theme === 'light');
  }

  private readInitial(): ThemeName {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey) as ThemeName | null;
        if (stored === 'light' || stored === 'dark') {
          return stored;
        }
      }
    } catch {
      // ignore
    }

    const prefersDark = this.document?.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
    return prefersDark ? 'dark' : 'light';
  }
}
