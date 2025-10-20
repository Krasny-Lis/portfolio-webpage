import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DestroyRef } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [NgIf],
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackToTopComponent {
  readonly visible = signal(false);
  private destroyRef = inject(DestroyRef);
  private translations = inject(TranslationService);
  readonly t = this.translations.translations;

  constructor() {
    effect(() => {
      if (typeof window === 'undefined') {
        return;
      }
      const listener = () => this.visible.set(window.scrollY > 400);
      listener();
      window.addEventListener('scroll', listener, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', listener));
    });
  }

  scrollTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
