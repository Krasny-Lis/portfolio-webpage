import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'portfolio-theme';
  private document = inject(DOCUMENT);
  private themeSignal = signal<ThemeName>(this.readInitial());
  private transitionTimer: number | null = null;

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
    effect(() => this.applyTheme(this.themeSignal()));
  }

  toggle(): void {
    const nextTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.withTransition(() => this.setTheme(nextTheme));
  }

  setTheme(theme: ThemeName): void {
    if (this.themeSignal() === theme) {
      return;
    }
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

  private withTransition(action: () => void): void {
    const body = this.document.body;
    body.classList.add('theme-transition');
    const docWithTransition = this.document as Document & {
      startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
    };

    const startTransition = docWithTransition.startViewTransition?.bind(this.document);

    if (startTransition) {
      void startTransition(action).finished.finally(() => this.clearTransitionFlag());
    } else {
      action();
      this.clearTransitionFlag();
    }
  }

  private clearTransitionFlag(): void {
    const windowRef = this.document.defaultView;
    if (!windowRef) {
      this.document.body.classList.remove('theme-transition');
      return;
    }

    if (this.transitionTimer !== null) {
      windowRef.clearTimeout(this.transitionTimer);
    }

    this.transitionTimer = windowRef.setTimeout(() => {
      this.document.body.classList.remove('theme-transition');
      this.transitionTimer = null;
    }, 600);
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
